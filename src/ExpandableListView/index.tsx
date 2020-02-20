import React, {Component} from 'react';
import {FlatList} from 'react-native';

import {StyleSheet} from 'react-native'

import ListView from './ListView';

interface InnerItem{
  item: Object;
  index: number;
  name: String;
  innerCellHeight?: number;
}

interface Item extends Array<any>{
  isExpanded: Boolean;
  item: InnerItem;
  index: number;
  cellHeight?: number;
  categoryName: String;
  id: number;
  subCategory: Array<InnerItem>
}

interface Props extends Object{
  itemContainerStyle?: StyleSheet;
  itemLabelStyle?: StyleSheet;
  headerContainerStyle?: StyleSheet;
  headerLabelStyle?: StyleSheet;
  customComponent?: Component;
  headerImageIndicatorStyle?: StyleSheet;
  customChevron?: String;
  chevronColor?: String;
  item: Item;
  index: number;
  height?: number; 
  data: Item;
  onInnerItemClick: Function;
  onItemClick: Function;
}

export default class ExpandableListView extends Component {

  static props : Props

  renderItem = (item: Item, index: number) => {
    return (
      <ListView
        customComponent={ExpandableListView.props.customComponent}
        headerImageIndicatorStyle={ExpandableListView.props.headerImageIndicatorStyle}
        itemLabelStyle={ExpandableListView.props.itemLabelStyle}
        itemContainerStyle={ExpandableListView.props.itemContainerStyle}
        headerContainerStyle={ExpandableListView.props.headerContainerStyle}
        headerLabelStyle={ExpandableListView.props.headerLabelStyle}
        customChevron={ExpandableListView.props.customChevron}
        chevronColor={ExpandableListView.props.chevronColor}
        item={item}
        index={index}
        data={ExpandableListView.props.data}
        onItemClick={ExpandableListView.props.onItemClick}
        onInnerItemClick={ExpandableListView.props.onInnerItemClick}
      />
    );
  };

  render() {
    return (
      <FlatList
        keyExtractor={({index}: {index: number}) => index.toString()}
        data={ExpandableListView.props.data}
        renderItem={({item}:{item: Item}, {index}: {index: number}) => this.renderItem(item, index)}
      />
    );
  }
}
