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
        headerImageIndicatorStyle={this.props.headerImageIndicatorStyle}
        itemLabelStyle={this.props.itemLabelStyle}
        itemContainerStyle={this.props.itemContainerStyle}
        headerContainerStyle={this.props.headerContainerStyle}
        headerLabelStyle={this.props.headerLabelStyle}
        customChevron={this.props.customChevron}
        chevronColor={this.props.chevronColor}
        item={item}
        data={this.props.data}
        onItemClick={this.props.onItemClick}
        onInnerItemClick={this.props.onInnerItemClick}
      />
    );
  };

  render() {
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={this.props.data}
        renderItem={item => this.renderItem(item)}
      />
    );
  }
}
