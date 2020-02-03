import React, {Component, Fragment} from 'react';

import {
  View,
  TouchableOpacity,
  Animated,
  FlatList,
  Text,
  Easing,
} from 'react-native';

import styles from '../styles';

import chevronWhite from '../assets/images/arrow_white.png';
import chevronBlack from '../assets/images/arrow_black.png';

export default class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      index: null,
      animatedValue: new Animated.Value(0),
      rotateValueHolder: new Animated.Value(0),
    };
  }

  updateLayout = index => {
    const array = [...this.props.data];
    array.map((value, placeindex) => {
      if (placeindex === index) {
        array[placeindex].isExpanded = !array[placeindex].isExpanded;
        this.setState({index: index});
      } else {
        array[placeindex].isExpanded = false;
      }
    });
    return this.props.onItemClick(array);
  };

  static getDerivedStateFromProps(props, state) {
    if (state.index !== null) {
      if (props.data[state.index].isExpanded) {
        let height = 0
        props.data[state.index].subCategory.map(innerItem => {
          height = height + 
            (innerItem.innerCellHeight !== undefined 
          ? 
            innerItem.innerCellHeight 
          : 
            props.itemContainerStyle !== undefined && props.itemContainerStyle.height !== undefined
          ? 
            props.itemContainerStyle.height 
          : 
            40)
        })
        Animated.spring(state.animatedValue, {
          friction: 10,
          toValue: height,
          easing: Easing.linear,
        }).start();
        Animated.timing(state.rotateValueHolder, {
          toValue: 1,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(state.animatedValue, {
          friction: 10,
          toValue: 0,
          easing: Easing.linear,
        }).start();
        Animated.timing(state.rotateValueHolder, {
          toValue: 1,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      }
    }
    return null;
  }

  renderInnerItem = item => {
    let {itemContainerStyle, itemLabelStyle} = this.props;
    itemContainerStyle = {
      ...styles.content,
      ...itemContainerStyle,
      height: (
          item.item.innerCellHeight !== undefined 
        ? 
          item.item.innerCellHeight 
        : 
          this.props.itemContainerStyle !== undefined && this.props.itemContainerStyle.height !== undefined
        ? 
          this.props.itemContainerStyle.height 
        : 
          40
      )
    }

    itemLabelStyle = {
      ...styles.text,
      ...itemLabelStyle,
    }

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        key={Math.random}
        style={itemContainerStyle}
        onPress={() => this.props.onInnerItemClick(item)}>
          <Text style={itemLabelStyle}>{item.item.name}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    let {headerContainerStyle, headerLabelStyle, headerImageIndicatorStyle} = this.props;
    headerContainerStyle = {
      ...styles.header,
      ...headerContainerStyle,
      height: (
        this.props.item.item.cellHeight !== undefined 
      ? 
      this.props.item.item.cellHeight 
      : 
        this.props.headerContainerStyle !== undefined && this.props.headerContainerStyle.height !== undefined
      ? 
        this.props.headerContainerStyle.height 
      : 
        40
    )
    }
    headerLabelStyle = {
      ...styles.headerText,
      ...headerLabelStyle
    }
    headerImageIndicatorStyle = {
      ...headerImageIndicatorStyle,
    }

    return (
      <Fragment>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => this.updateLayout(this.props.item.index)}
          style={headerContainerStyle}>
          <Animated.Image
            source = {
              this.props.customChevron !== undefined 
                ? this.props.customChevron
                : this.props.chevronColor != undefined &&
                this.props.chevronColor == 'white' ?
                chevronWhite : chevronBlack
            }
            resizeMethod="scale"
            resizeMode="contain"
            style={
              [
                headerImageIndicatorStyle,
                this.props.item.item.isExpanded && {
                  transform: [
                    {
                      rotate: this.state.rotateValueHolder.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          '0deg',
                          this.props.item.item.isExpanded
                            ? '90deg'
                            : '-90deg',
                        ],
                      }),
                    },
                  ],
                },
              ]
            }
          />
          <Text style={headerLabelStyle}>
            {this.props.item.item.categoryName}
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            // eslint-disable-next-line react-native/no-inline-styles
            {
              height: this.state.animatedValue,
              overflow: 'hidden',
            },
          ]}>
          <FlatList
            keyExtractor={() => Math.random().toString()}
            listKey={() => this.props.item.item.id + this.props.item.index}
            data={this.props.item.item.subCategory}
            renderItem={(innerItem, index) => this.renderInnerItem(innerItem)}
          />
        </Animated.View>
      </Fragment>
    );
  }
}
