import React, {Component, Fragment} from 'react';

import {TouchableOpacity, Animated, FlatList, Text, Easing} from 'react-native';

import styles from './styles';

import chevronWhite from './assets/images/arrow_white.png';
import chevronBlack from './assets/images/arrow_black.png';

interface InnerItem extends Object {
  innerCellHeight?: number;
  name?: string;
  customInnerItem?: Component;
}

interface Item extends Object {
  id: number;
  cellHeight?: number;
  isExpanded: boolean;
  subCategory: Array<InnerItem>;
  categoryName?: string;
  customItem?: Component;
}

interface State extends Object {
  index: number;
  animatedValues: Array<Animated.Value>;
  rotateValueHolder: Array<Animated.Value>;
}

interface Style extends Object {
  height?: number;
  marginVertical?: number;
  marginBottom?: number;
  marginTop?: number;
  margin?: number;
}

interface Props {
  data: Array<Item>;
  /** Callback for item click */
  onItemClick: Function;
  /** Callback for inner item click */
  onInnerItemClick: Function;
  /** Add style to each inner item container */
  itemContainerStyle?: Style;
  /** Add style to each inner item label */
  itemLabelStyle: Object;
  /** Add style to each item container */
  headerContainerStyle?: Style;
  /** Add style to each item label */
  headerLabelStyle?: Style;
  /** Add style to the item indicator */
  headerImageIndicatorStyle?: Style;
  /** Pass the path for your custom indicator */
  customChevron?: string;
  /** Color for default indicator */
  chevronColor?: 'white' | 'black';
  props: Object;
}

export default class ExpandableListView extends Component<Props> {
  props!: Props;
  setState!: Function;

  state = {
    data: this.props.data,
    index: null,
    animatedValues: [],
    rotateValueHolder: [],
  };

  componentDidMount() {
    let animatedValues: Array<Animated.Value> = [];
    let rotateValueHolder: Array<Animated.Value> = [];
    this.state.data.map(() => {
      animatedValues.push(new Animated.Value(0));
      rotateValueHolder.push(new Animated.Value(0));
    });
    this.setState({
      animatedValues,
      rotateValueHolder,
    });
  }

  updateLayout = (index: number) => {
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

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.index !== null) {
      if (props.data[state.index].isExpanded) {
        let height = 0;
        props.data[state.index].subCategory.map(innerItem => {
          height =
            height +
            (innerItem.innerCellHeight !== undefined
              ? innerItem.innerCellHeight
              : props.itemContainerStyle !== undefined &&
                props.itemContainerStyle.height !== undefined
              ? props.itemContainerStyle.height
              : 40);
          height =
            height +
            (props.itemContainerStyle !== undefined
              ? props.itemContainerStyle.margin !== undefined
                ? props.itemContainerStyle.margin * 2
                : 0
              : 0);
          height =
            height +
            (props.itemContainerStyle !== undefined
              ? props.itemContainerStyle.marginVertical !== undefined
                ? props.itemContainerStyle.marginVertical * 2
                : 0
              : 0);
          height =
            height +
            (props.itemContainerStyle !== undefined
              ? props.itemContainerStyle.marginBottom !== undefined
                ? props.itemContainerStyle.marginBottom
                : 0
              : 0);
          height =
            height +
            (props.itemContainerStyle !== undefined
              ? props.itemContainerStyle.marginTop !== undefined
                ? props.itemContainerStyle.marginTop
                : 0
              : 0);
        });
        Animated.spring(state.animatedValues[state.index], {
          friction: 10,
          toValue: height,
        }).start();
        Animated.timing(state.rotateValueHolder[state.index], {
          toValue: 1,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start();
        for (let i = 0; i < state.animatedValues.length; i++) {
          if (!props.data[i].isExpanded) {
            Animated.spring(state.animatedValues[i], {
              friction: 10,
              toValue: 0,
            }).start();
            Animated.timing(state.rotateValueHolder[i], {
              toValue: 1,
              duration: 250,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start();
          }
        }
      } else {
        for (let i = 0; i < state.animatedValues.length; i++) {
          if (!props.data[i].isExpanded) {
            Animated.spring(state.animatedValues[i], {
              friction: 10,
              toValue: 0,
            }).start();
            Animated.timing(state.rotateValueHolder[i], {
              toValue: 1,
              duration: 250,
              easing: Easing.linear,
              useNativeDriver: true,
            }).start();
          }
        }
      }
    }
    return null;
  }

  renderInnerItem = (itemO: any, headerItem: Item, headerIndex: number) => {
    let {item}: {item: InnerItem} = itemO;
    let {index}: {index: number} = itemO;
    let {itemContainerStyle, itemLabelStyle} = this.props;
    itemContainerStyle = {
      ...styles.content,
      ...itemContainerStyle,
      height:
        item.innerCellHeight !== undefined
          ? item.innerCellHeight
          : this.props.itemContainerStyle !== undefined &&
            this.props.itemContainerStyle.height !== undefined
          ? this.props.itemContainerStyle.height
          : 40,
    };

    itemLabelStyle = {
      ...styles.text,
      ...itemLabelStyle,
    };

    let CustomComponent = item.customInnerItem;

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        key={Math.random()}
        style={itemContainerStyle}
        onPress={() =>
          this.props.onInnerItemClick(index, headerItem, headerIndex)
        }>
        {CustomComponent !== undefined ? (
          CustomComponent
        ) : (
          <Text style={itemLabelStyle}>{item.name}</Text>
        )}
      </TouchableOpacity>
    );
  };

  renderItem = (itemO: any) => {
    let {item}: {item: Item} = itemO;
    let {index}: {index: number} = itemO;
    let {
      headerContainerStyle,
      headerLabelStyle,
      headerImageIndicatorStyle,
    } = this.props;
    headerContainerStyle = {
      ...styles.header,
      ...headerContainerStyle,
      height:
        item.cellHeight !== undefined
          ? item.cellHeight
          : this.props.headerContainerStyle !== undefined &&
            this.props.headerContainerStyle.height !== undefined
          ? this.props.headerContainerStyle.height
          : 40,
    };
    headerLabelStyle = {
      ...styles.headerText,
      ...headerLabelStyle,
    };
    headerImageIndicatorStyle = {
      ...headerImageIndicatorStyle,
    };

    let CustomComponent = item.customItem;

    return (
      <Fragment>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => this.updateLayout(index)}
          style={headerContainerStyle}>
          {CustomComponent !== undefined ? (
            CustomComponent
          ) : (
            <Fragment>
              <Animated.Image
                source={
                  this.props.customChevron !== undefined
                    ? this.props.customChevron
                    : this.props.chevronColor !== undefined &&
                      this.props.chevronColor === 'white'
                    ? chevronWhite
                    : chevronBlack
                }
                resizeMethod="scale"
                resizeMode="contain"
                style={[
                  headerImageIndicatorStyle,
                  {
                    transform: [
                      {
                        rotate: item.isExpanded ? '90deg' : '0deg',
                      },
                    ],
                  },
                ]}
              />
              <Text style={headerLabelStyle}>{item.categoryName}</Text>
            </Fragment>
          )}
        </TouchableOpacity>
        <Animated.View
          style={[
            // eslint-disable-next-line react-native/no-inline-styles
            {
              height: this.state.animatedValues[index],
              overflow: 'hidden',
            },
          ]}>
          <FlatList
            keyExtractor={() => Math.random().toString()}
            listKey={String(item.id + index)}
            data={item.subCategory}
            renderItem={(innerItem: any) =>
              this.renderInnerItem(innerItem, item, index)
            }
          />
        </Animated.View>
      </Fragment>
    );
  };

  render() {
    return (
      <FlatList
        keyExtractor={(item: any, index: number) => index.toString()}
        data={this.props.data}
        renderItem={(item: any) => this.renderItem(item)}
      />
    );
  }
}
