import React, {Component} from 'react';

import {View} from 'react-native';

import ExpandableListView from './ExpandableListView';

// import { Container } from './styles';

const CONTENT = [
  {
    cellHeight: 40,
    isExpanded: false,
    categoryName: 'Item 1',
    subCategory: [
      {id: 1, name: 'Sub Cat 1'},
      {id: 3, name: 'Sub Cat 3'},
    ],
  },
  {
    cellHeight: 40,
    isExpanded: false,
    categoryName: 'Item 2',
    subCategory: [
      {id: 4, name: 'Sub Cat 4'},
      {id: 5, name: 'Sub Cat 5'},
    ],
  },
  {
    cellHeight: 40,
    isExpanded: false,
    categoryName: 'Item 7',
    subCategory: [{id: 20, name: 'Sub Cat 20'}],
  },
  {
    cellHeight: 40,
    isExpanded: false,
    categoryName: 'Item 8',
    subCategory: [{id: 22, name: 'Sub Cat 22'}],
  },
];

export default class src extends Component {
  state = {
    listDataSource: CONTENT,
  };

  updateLayout = listDataSource => {
    this.setState({
      listDataSource,
    });
  };

  handleInnerClick = item => {
    console.log(item);
  };

  render() {
    return (
      <View>
        <ExpandableListView
          listHeaderStyles={{
            height: 30,
          }}
          list={this.state.listDataSource}
          onInnerItemClick={this.handleInnerClick.bind(this)}
          onItemClick={this.updateLayout.bind(this)}
        />
      </View>
    );
  }
}
