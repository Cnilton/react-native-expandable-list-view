import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#e5f5Ff',
  },
  topHeading: {
    paddingLeft: 10,
    fontSize: 20,
  },
  header: {
    height: 50,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d5FCFF',
    padding: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#808080',
    width: '100%',
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 16,
  },
  content: {
    height: 40,
    justifyContent: 'center',
    borderBottomColor: '#808080',
    borderBottomWidth: 1,
    backgroundColor: '#e5f5Ff',
  },
});

export default styles;
