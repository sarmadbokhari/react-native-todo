/* @flow */

import React, { Component } from 'react';
import {
  View, Text, StyleSheet, Switch, TouchableOpacity, TextInput
} from 'react-native';

export default class Row extends Component {
  render() {
    const complete = this.props.complete;

    const textComponent = (
      <View style={styles.textWrap}>
        <Text style={[styles.text, complete && styles.complete]}>{this.props.text}</Text>
      </View>
    );

    const removeButton = (
      <TouchableOpacity onPress={this.props.onRemove}>
        <Text style={styles.destroy}>X</Text>
      </TouchableOpacity>
    )

    const editingComponent = (
      <View style={styles.textWrap}>
        <TextInput
          onChangeText={this.props.onUpdate}
          autoFocus
          value={this.props.text}
          style={styles.input}
          multiline
        />
      </View>
    )

    const doneButton = (
      <TouchableOpacity style={styles.done} onPress={() => this.props.onToggleEdit(false)}>
        <Text style={styles.doneText}>Save</Text>
      </TouchableOpacity>
    )

    return (
      <TouchableOpacity style={styles.container} onLongPress={() => this.props.onToggleEdit(true)}>
        <Switch
          value={complete}
          onValueChange={this.props.onComplete}></Switch>
        {this.props.editing ? editingComponent : textComponent}
        {this.props.editing ? doneButton : removeButton}
      </TouchableOpacity>
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
  },
  input: {
    height: 100,
    flex: 1,
    fontSize: 24,
    padding: 0,
    color: '#4d4d4d'
  },
  done: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#7be290',
    padding: 7
  },
  doneText: {
    color: '#4d4d4d',
    fontSize: 20
  }
});
