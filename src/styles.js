import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5f5Ff',
    padding: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  text: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 16,
  },
  content: {
    justifyContent: 'center',
  },
  headerSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#c1c2c3',
    alignSelf: 'center',
  },
  innerItemSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#c1c2c3',
    alignSelf: 'center',
  },
});
