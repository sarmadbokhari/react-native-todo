/* @flow */

import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Switch, TouchableOpacity
} from 'react-native';

export default class Row extends Component {
  render() {
    const complete = this.props.complete;
    return (
      <View style={styles.container}>
        <Switch
          value={complete}
          onValueChange={this.props.onComplete}></Switch>
        <View style={styles.textWrap}>
          <Text style={[styles.text, complete && styles.complete]}>{this.props.text}</Text>
        </View>
        <TouchableOpacity onPress={this.props.onRemove}>
          <Text style={styles.destroy}>X</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 24,
    color: '#4D4D4D'
  },
  textWrap: {
    flex: 1,
    marginHorizontal: 10
  },
  complete: {
    textDecorationLine: 'line-through'
  },
  destroy: {
    fontSize: 20,
    color: "#cc9a9a"
  }
});
