import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TouchableHighlight, 
    Alert, 
    Dimensions, 
    Modal, 
    BackHandler, 
    Image 
} from 'react-native';
import styles from './styles';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { width } from '../config';
import RNIap, {
  Product,
  ProductPurchase,
  acknowledgePurchaseAndroid,
  purchaseUpdatedListener,
  purchaseErrorListener,
  PurchaseError,
} from 'react-native-iap';

const itemSkus = Platform.select({
    ios: [
      'com.cooni.point1000', 'com.cooni.point5000', // dooboolab
    ],
    android: [
      'android.test.purchased'//, 'android.test.refunded', 'android.test.purchased', 'android.test.canceled',
      // 'point_1000', '5000_point', // dooboolab
    ],
  });
  
  const itemSubs = Platform.select({
    ios: [
      'com.cooni.point1000', 'com.cooni.point5000', // dooboolab
    ],
    android: [
      'test.sub1', // subscription
    ],
  });

export default class Purchase extends Component{
    constructor(props) {
        super(props)
    
        this.state = {
          productList: [],
          receipt: '',
          availableItemsMessage: '',
          getHeart: 0,
        };
        
      }
}