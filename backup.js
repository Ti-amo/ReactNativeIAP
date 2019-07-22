
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
    'android.test.refunded'//, 'android.test.item_unavailable', 'android.test.refunded', 'android.test.canceled',
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

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export default class Play extends Component {
  constructor(props) {
    super(props)

    this.state = {
      productList: [],
      receipt: '',
      availableItemsMessage: '',
      getHeart: 0,
      status: 0
    };
    
  }

  async componentDidMount() {
    try {
      const result = await RNIap.initConnection();
      await RNIap.consumeAllItemsAndroid();
      console.log('result', result);
    } catch (err) {
      //console.log(err.code, err.message);
    }
    // purchaseUpdateSubscription = purchaseUpdatedListener(async(purchase) => {
    //   console.log('purchaseUpdatedListener', purchase);
    //   this.setState({status : purchase.purchaseStateAndroid})
    //   if (status === 1 && !purchase.isAcknowledgedAndroid) {
    //     try {
    //       const ackResult = await acknowledgePurchaseAndroid(purchase.purchaseToken);
    //       console.log('ackResult', ackResult);
    //     } catch (ackErr) {
    //       console.warn('ackErr', ackErr);
    //     }
    //   }
    //   this.setState({ receipt: purchase.transactionReceipt }, () => this.goNext());
    // });
    try {
      const products = await RNIap.getProducts(itemSkus);
      // const products = await RNIap.getSubscriptions(itemSkus);
      //console.warn('Products', products);
      this.setState({ productList: products });
    } catch (err) {
     // console.log(err.code, err.message);
    }
  }

  async componentWillUnmount() {
    await RNIap.endConnectionAndroid();
    // await RNIap.consumeAllItemsAndroid();
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
  }


  goNext = () => {
    Alert.alert('Receipt', this.state.receipt);
  }
  // getItems = async() => {
  //   try {
  //     const products = await RNIap.getProducts(itemSkus);
  //     // const products = await RNIap.getSubscriptions(itemSkus);
  //     console.log('Products', products);
  //     this.setState({ productList: products });
  //   } catch (err) {
  //     console.warn(err.code, err.message);
  //   }
  // }

  // getSubscriptions = async() => {
  //   try {
  //     const products = await RNIap.getSubscriptions(itemSubs);
  //     console.log('Products', products);
  //     this.setState({ productList: products });
  //   } catch (err) {
  //     console.warn(err.code, err.message);
  //   }
  // }
  requestPurchase = async(sku) => {
    try {
      const products = await RNIap.getProducts(itemSkus);
      RNIap.requestPurchase(sku);
      
    } catch (err) {
      //console.log(err.code, err.message);
    }
    if (this.state.receipt != null) {
      this.setState({
        getHeart : this.state.getHeart + 5,
        status: 0
      })
    } else {
      this.setState({getHeart: this.state.getHeart})
    }
  }

  requestSubscription = async(sku) => {
    try {
      RNIap.requestSubscription(sku);
    } catch (err) {
      Alert.alert(err.message);
    }
  }

  render() {
    const { productList, receipt, availableItemsMessage } = this.state;
    return (
      <View style={styles.mainContainer}>
        <View style={{flex: 1}}>
          <View style={styles.styleimage}>
            <Image
              style={styles.stretch}
              source={require('../images/freakingmath.jpg')}
            />
          </View>
          
        </View>
        <View style={{flex: 1, flexDirection: 'column'}}>
        
          <View style={styles.styleIcon}>
            <TouchableNativeFeedback 
              onPress={() => this.props.navigation.replace('Screen_SC02',{ 
                heart : this.state.getHeart,
                productList: this.state.productList
              }) }
              style={styles.styleButton}>
              <Image
                //style={{width: 100, height: 100}}
                source={require('../images/play.png')}
              />
            </TouchableNativeFeedback>
          </View>
      {
              productList.map((product, i) => {
                return (
          <View key={i} style={styles.styleIcon}>
            
            <TouchableNativeFeedback
                onPress={() => this.requestPurchase(product.productId)}
                style={styles.styleButton}>
              <Image
                //style={{width: 100, height: 100}}
                source={require('../images/purchase.png')}
              />
            </TouchableNativeFeedback>
          </View>
          );
        })
      }
          <View style={{flex: 1}}>
            <TouchableNativeFeedback>
            
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    );
  }
};

