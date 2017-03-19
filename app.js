/* @flow */

import React, { Component } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, Platform, ListView, Keyboard, AsyncStorage
} from 'react-native';
import Header from './header';
import Footer from './footer';
import Row from './row';

const filterItems = (filter, items) => {
  return items.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return !item.complete;
    if (filter === 'COMPLETED') return item.complete;
  })
}

export default class App extends Component {
  constructor(props) {
    super(props);

    // helps ListView render efficiently
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.state = {
      loading: true,
      value: '',
      items: [],
      allComplete: false,
      dataSource: ds.cloneWithRows([]),
      filter: 'ALL'
    }

    this.setSource = this.setSource.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this);
    this.handleToggleComplete = this.handleToggleComplete.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleClearComplete = this.handleClearComplete.bind(this);
  }

  componentWillMount() {
    AsyncStorage.getItem('items').then((json) => {
      try {
        const items = JSON.parse(json);
        this.setSource(items, items, { loading: false });
      } catch(e) {
        this.setState({ loading: false });
      }
    })
  }

  setSource(items, itemsDatesource, otherState = {}) {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDatesource),
      ...otherState
    })

    AsyncStorage.setItem('items', JSON.stringify(items));
  }

  handleAddItem() {
    if(!this.state.value) return;

    const newItems = [
      ...this.state.items,
      {
        key: Date.now(),
        text: this.state.value,
        complete: false
      }
    ]

    this.setSource(newItems, filterItems(this.state.filter, newItems), { value: '' });
  }

  handleToggleAllComplete() {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => ({
      ...item,
      complete
    }))

    console.table(newItems);

    this.setSource(newItems, filterItems(this.state.filter, newItems), { allComplete: complete });
  }

  handleToggleComplete(key, complete) {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;
      return {
        ...item,
        complete
      }
    });
    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleRemoveItem(key) {
    const newItems = this.state.items.filter((item) => {
      return item.key !== key;
    })

    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleFilter(filter) {
    this.setSource(this.state.items, filterItems(filter, this.state.items), { filter })
  }

  handleClearComplete() {
    const newItems = filterItems('PENDING', this.state.items);
    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={(value) => this.setState({ value })}
          onToggleAllComplete={this.handleToggleAllComplete}/>
        <View style={styles.content}>
          <ListView
            style={styles.list}
            enableEmptySections
            dataSource={this.state.dataSource}
            onScroll={() => Keyboard.dismiss()}
            renderRow={({key, ...value}) => {
              return (
                <Row
                  key={key}
                  onRemove={() => this.handleRemoveItem(key)}
                  onComplete={(complete) => this.handleToggleComplete(key, complete)}
                  {...value}
                />
              )
            }}
            renderSeparate={(sectionId, rowId) => {
              return <View key={rowId} style={styles.separator} />
            }}>
          </ListView>
        </View>
        <Footer
          count={filterItems('PENDING', this.state.items).length}
          onFilter={this.handleFilter}
          filter={this.state.filter}
          onClearComplete={this.handleClearComplete} />
        {this.state.loading && <View style={styles.loading}>
          <ActivityIndicator
            animating
            size="large"
          />
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    ...Platform.select({
      ios: { paddingTop: 30 }
    })
  },
  content: {
    flex: 1
  },
  list: {
    backgroundColor: 'white'
  },
  separator: {
    borderWidth: 1,
    borderColor: "#F5F5F5"
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
})
