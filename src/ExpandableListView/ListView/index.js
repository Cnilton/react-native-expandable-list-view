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
      list: props.list,
      index: null,
      animatedValue: new Animated.Value(0),
      rotateValueHolder: new Animated.Value(0),
    };
  }

  updateLayout = index => {
    const array = [...this.props.list];
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
      if (props.list[state.index].isExpanded) {
        Animated.spring(state.animatedValue, {
          friction: 10,
          toValue:
            props.list[state.index].cellHeight *
            props.list[state.index].subCategory.length,
          easing: Easing.linear,
        }).start();
        Animated.timing(state.rotateValueHolder, {
          toValue: 1,
          duration: 500,
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
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
      }
    }
    return null;
  }

  renderInnerItem = item => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        key={Math.random}
        style={styles.content}
        onPress={() => this.props.onInnerItemClick(item)}>
        <View>
          <Text style={styles.text}>{item.item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    let {listHeaderStyles} = this.props;
    return (
      <Fragment>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => this.updateLayout(this.props.item.index)}
          style={styles.header}>
          <Animated.Image
            source={
              this.props.chevronColor != undefined &&
              this.props.chevronColor == 'white'
                ? chevronWhite
                : chevronBlack
            }
            resizeMethod="scale"
            resizeMode="contain"
            style={[
              this.props.item.item.isExpanded && {
                transform: [
                  {
                    rotate: this.state.rotateValueHolder.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        '0deg',
                        this.state.list[this.state.index].isExpanded
                          ? '90deg'
                          : '-90deg',
                      ],
                    }),
                  },
                ],
              },
            ]}
          />
          <Text style={styles.headerText}>
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
            keyExtractor={() => Math.random()}
            listKey={() => this.props.item.item.id + this.props.item.index}
            data={this.props.item.item.subCategory}
            renderItem={(innerItem, index) => this.renderInnerItem(innerItem)}
          />
        </Animated.View>
      </Fragment>
    );
  }
}
