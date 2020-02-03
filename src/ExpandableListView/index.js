import React, {Component} from 'react';
import {FlatList} from 'react-native';

import ListView from './ListView';

export default class ExpandableListView extends Component {
  constructor(props) {
    super(props);
  }

  renderItem = item => {
    return (
      <ListView
        listHeaderStyles={this.props.listHeaderStyles}
        item={item}
        list={this.props.list}
        onItemClick={this.props.onItemClick}
        onInnerItemClick={this.props.onInnerItemClick}
      />
    );
  };

  render() {
    return (
      <FlatList
        data={this.props.list}
        renderItem={item => this.renderItem(item)}
      />
    );
  }
}
