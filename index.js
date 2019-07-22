/**
 * @format
 */

import {AppRegistry, YellowBox} from 'react-native';
//import App from './App';
import {name as appName} from './app.json';
import {Play} from './app/SC01'
import {Game} from './app/SC02'
import {createStackNavigator, createAppContainer} from 'react-navigation'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
console.disableYellowBox = true;

const Router = createStackNavigator({
    Screen_SC01: {
        screen:Play,
        navigationOptions:{
            header:null
        }
    },
    Screen_SC02: {
        screen:Game,
        navigationOptions:{
            header:null
        }
    },
  },
    {
        initialRouteName: 'Screen_SC01',
    }
);

const App = createAppContainer(Router);

AppRegistry.registerComponent(appName, () => App);
