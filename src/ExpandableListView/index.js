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
        itemContainerStyle={this.props.itemContainerStyle}
        headerContainerStyle={this.props.headerContainerStyle}
        headerLabelStyle={this.props.headerLabelStyle}
        customChevron={this.props.customChevron}
        chevronColor={this.props.chevronColor}
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
        keyExtractor={item => item.index}
        data={this.props.list}
        renderItem={item => this.renderItem(item)}
      />
    );
  }
}
