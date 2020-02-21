import React, {Component} from 'react';
import {FlatList} from 'react-native';

import ListView from './ListView';

interface InnerItem {
  item: Object;
  index: number;
  name: String;
  innerCellHeight?: number;
}

interface Item extends Array<any> {
  isExpanded: Boolean;
  item: InnerItem;
  index: number;
  cellHeight?: number;
  categoryName: String;
  id: number;
  subCategory: Array<InnerItem>;
}

interface Props extends Object {
  /** Add styles to each inner item container */
  itemContainerStyle?: Object;
  /** Add styles to the label of the inner item */
  itemLabelStyle?: Object;
  /** Add styles to each item container */
  headerContainerStyle?: Object;
  /** Add styles to the label of the item */
  headerLabelStyle?: Object;
  /** Pass the component you want inside the expandable list */
  customComponent?: Component;
  /** Add styles to image indicator */
  headerImageIndicatorStyle?: Object;
  /** Add your own indicator, by passing it's path */
  customChevron?: String;
  /** Add styles to the label of the inner item */
  chevronColor?: 'white' | 'black';
  /** Data for the expandable list */
  data: Item;
  /** Callback on inner item click */
  onInnerItemClick: Function;
  /** Callback on item click */
  onItemClick: Function;
}

export default class ExpandableListView extends Component<Props> {
  props!: Props;
  renderItem = (itemO: any) => {
    let {item}: {item: Item} = itemO;
    let {index}: {index: number} = itemO;
    return (
      <ListView
        customComponent={this.props.customComponent}
        headerImageIndicatorStyle={this.props.headerImageIndicatorStyle}
        itemLabelStyle={this.props.itemLabelStyle}
        itemContainerStyle={this.props.itemContainerStyle}
        headerContainerStyle={this.props.headerContainerStyle}
        headerLabelStyle={this.props.headerLabelStyle}
        customChevron={this.props.customChevron}
        chevronColor={this.props.chevronColor}
        item={item}
        index={index}
        data={this.props.data}
        onItemClick={this.props.onItemClick}
        onInnerItemClick={this.props.onInnerItemClick}
      />
    );
  };

  render() {
    return (
      <FlatList
        keyExtractor={({index}: {index: number}) => index.toString()}
        data={this.props.data}
        renderItem={item => this.renderItem(item)}
      />
    );
  }
}
