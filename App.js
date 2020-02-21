import React, {Component} from 'react';

import {View, Image} from 'react-native';

import img from './src/ExpandableListView/assets/images/arrow_black.png';

import ExpandableListView from './src/ExpandableListView';

// import { Container } from './styles';

const CONTENT = [
  {
    isExpanded: false,
    categoryName: 'Item 1',
    subCategory: [
      {id: 1, name: 'Sub Cat 1'},
      {id: 3, name: 'Sub Cat 3'},
    ],
  },
  {
    isExpanded: false,
    categoryName: 'Item 8',
    subCategory: [{id: 22, name: 'Sub Cat 22'}],
  },
];

export default class Expandable extends Component {
  state = {
    listDataSource: CONTENT,
  };

  updateLayout = listDataSource => {
    //required
    this.setState({
      listDataSource,
    });
  };

  handleInnerClick = (innerIndex, headerItem) => {
    // required
    console.log(headerItem);
  };

  render() {
    return (
      <ExpandableListView
        customComponent={<Image source={img} style={{height: 100}} />}
        data={this.state.listDataSource} // required
        onInnerItemClick={this.handleInnerClick.bind(this)} // required
        onItemClick={this.updateLayout.bind(this)} //required
      />
    );
  }
}
