import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json

import Api from './Api'

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button 
         raised
         icon={{name: 'cached'}}
          title="Push for Movie"
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    return (
      <Api />
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
