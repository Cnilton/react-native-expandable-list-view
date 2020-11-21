![npm](https://img.shields.io/npm/v/react-native?color=%232fa90f&label=react-native&style=plastic)
![npm](https://img.shields.io/npm/dm/react-native-expandable-listview?style=plastic)

# About

This is a React-Native ExpandableListView component that you can freely modify its styles.

## Instalation

To install just input the following command:

```bash
npm i react-native-expandable-listview
```

or

```bash
yarn add react-native-expandable-listview
```

## Data Structure

```javascript
const CONTENT = [
  {
    id: '1', // required, id of item
    categoryName: 'Item 1', // label of item expandable item
    subCategory: [
      // required, array containing inner objects
      {
        id: '3', // required, of inner object
        name: 'Sub Cat 1', // required, label of inner object
      },
      {
        id: '4',
        name: 'Sub Cat 3',
      },
    ],
  },
  {
    id: '2',
    categoryName: 'Item 8',
    subCategory: [{id: '22', name: 'Sub Cat 22'}],
  },
];
```

## Basic Usage

<img src ="https://i.imgur.com/3erV2nG.gif" width="40%"/>

```javascript
//...
import React, {Component} from 'react';
import {ExpandableListView} from 'react-native-expandable-listview';

const CONTENT = [
  {
    id: '42',
    categoryName: 'Item 1',
    subCategory: [
      {
        id: '1',
        name:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged",
      },
      {id: '2', name: 'Sub Item 2'},
    ],
  },
  {
    id: '95',
    categoryName: 'Item 2',
    subCategory: [{id: '1', name: 'Sub Item 1'}],
  },
  {
    id: '94',
    categoryName: 'Item 3',
    subCategory: [{id: '1', name: 'Sub Item 1'}],
  },
  {
    id: '93',
    categoryName: 'Item 4',
    subCategory: [{id: '1', name: 'Sub Item 1'}],
  },
  {
    id: '92',
    categoryName: 'Item 5',
    subCategory: [{id: '1', name: 'Sub Item 1'}],
  },
  {
    id: '96',
    categoryName: 'Item 6',
    subCategory: [{id: '1', name: 'Sub Item 1'}],
  },
];

function YourComponent() {
  function handleItemClick({index}) {
    console.log(index);
  };

  function handleInnerItemClick({innerIndex, item, itemIndex}) {
    console.log(innerIndex);
  };

  render() {
    return (
      <ExpandableListView
        data={CONTENT} // required
        onInnerItemClick={handleInnerItemClick}
        onItemClick={handleItemClick}
      />
    );
  }
}
```

## Advanced Usage

<img src ="https://i.imgur.com/PladoVm.gif" width="40%"/>

```javascript
//...
import React, {Component} from 'react';
import {Text, Image} from 'react-native';
import {ExpandableListView} from 'react-native-expandable-listview';

const CONTENT = [
  {
    id: '42',
    categoryName: 'Item 1',
    customItem: (
      <View style={{flexDirection: 'column'}}>
        <Text>Custom Item</Text>
        <Text>With</Text>
        <Text>what you</Text>
        <Text>want</Text>
      </View>
    ),
    subCategory: [
      {
        customInnerItem: (
          <View style={{flexDirection: 'column', marginLeft: 15}}>
            <Text>Inner Item</Text>
            <Text>With whatever you need</Text>
          </View>
        ),
        id: '1',
        name: '',
      },
      {id: '2', name: 'Sub Item 2'},
    ],
  },
  {
    id: '96',
    categoryName: 'Item 2',
    subCategory: [{id: '1', name: 'Sub Item 1'}],
  },
  {
    id: '12',
    categoryName: 'Item 3',
    subCategory: [
      {id: '1', name: 'Category 1'},
      {id: '2', name: 'Category 2'},
      {id: '3', name: 'Category 3'},
    ],
  },
];

function YourComponent() {
  const [listDataSource, setListDataSource] = useState([])

  function handleItemClick({index}) {
    console.log(index);
  };

  function handleInnerItemClick({innerIndex, item, itemIndex}) {
    console.log(innerIndex);
  };

  render() {
    return (
      <ExpandableListView
        // ExpandableListViewStyles={{borderTopWidth:1}} // styles to expandable listview
        // renderInnerItemSeparator={false} // true or false, render separator between inner items
        // renderItemSeparator={false} // true or false, render separator between Items
        // itemContainerStyle={{}} // add your styles to all item container of your list
        // itemLabelStyle={{}} // add your styles to all item text of your list
        // customChevron={{}} // your custom image to the indicator
        // chevronColor="white" // color of the default indicator
        // innerItemContainerStyle={{}} // add your styles to all inner item containers of your list
        // itemLabelStyle={{}} // add your styles to all inner item text of your list
        // itemImageIndicatorStyle={{}} // add your styles to the image indicator of your list
        // animated={true} // sets all animations on/off, default on
        // defaultLoaderStyles?: ViewStyle; // Set your styles to default loader (only for animated={true})
        // customLoader?: JSX.Element; Pass your custom loader, while your content is measured and rendered (only for animated={true})
        data={listDataSource}
        onInnerItemClick={handleInnerItemClick}
        onItemClick={handleItemClick}
      />
    );
  }
}
```

- All commented options above are optional.

- If you want to use the "customLoader" prop, provide JSX.Element or a Component, for example:

```javascript
import {View, ActivityIndicator} from 'react-native';
// ...
  const myLoader = (<View><ActivityIndicator /></View>)
```

- If you want to use the "customChevron" prop, provide a image path, for example:

```javascript
import chevron from '../assets/images/yourImage';
// ...
customChevron = {chevron};
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
