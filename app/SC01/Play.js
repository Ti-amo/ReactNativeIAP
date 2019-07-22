import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TouchableHighlight, 
    Alert, 
    Dimensions, 
    Modal, 
    BackHandler, 
	Platform,
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
    'android.test.refunded', 'android.test.purchased'//, 'android.test.item_unavailable', 'android.test.canceled',
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
      purchaseIndicator: false,
      validateItem: [],
      subscriptionIndicator: false,
      status: 0
    };
    
  }

  async componentDidMount() {
		try {
			const result = await RNIap.initConnection();
			const products = await RNIap.getProducts(itemSkus);
			this.setState({ productList: products });
			await RNIap.consumeAllItemsAndroid();
		} catch (err) {
			console.warn(err.code, err.message);
    }
    
      // const products = await RNIap.getSubscriptions(itemSkus);
      //console.warn('Products', products);
		//this.retriveData();
		purchaseUpdateSubscription = purchaseUpdatedListener(async(purchase) => {
			console.log('purchaseUpdatedListener', purchase);
			if (purchase.purchaseStateAndroid === 1 && !purchase.isAcknowledgedAndroid) {
			  try {
				const ackResult = await acknowledgePurchaseAndroid(purchase.purchaseToken);
				console.log('ackResult', ackResult);
			  } catch (ackErr) {
				console.warn('ackErr', ackErr);
			  }
			}
			this.setState({ receipt: purchase.transactionReceipt }, () => this.goNext());
		  });
	}

	getItemPurchaseInfo = async () => {
		try {
			this.setState({
				availableIndicator: true

			});
			const products = await RNIap.getProducts(itemSkus);
			if (Platform.OS === "ios") {
				this.setState(
					{
						productList: []
					},
					() => {
						this.getSubscriptionsInfo();
					}
				);
			} else {
				this.setState(
					{
						productList: products
					},
					() => {
						this.getSubscriptionsInfo();
					}
				);
			}
		} catch (err) {
			console.warn(err.code, err.message);
			if (Platform.OS === "ios") {
				this.setState(
					{
						productList: []
					},
					() => {
						this.getSubscriptionsInfo();
					}
				);
			} else {
				this.setState(
					{
						productList: products
					},
					() => {
						this.getSubscriptionsInfo();
					}
				);
			}

		}
	};

	getSubscriptionsInfo = async () => {
		try {
			const products = await RNIap.getSubscriptions(itemSubs);
			this.setState({
				productList: [],
				productList: [...this.state.productList, ...products],
				availableIndicator: false,
				modalVisible: true
			});
		} catch (err) {
			this.setState({
				availableIndicator: false,
				modalVisible: true
			});
			console.warn(err.code, err.message);
		}
	};

	afterSetStateChangePurchase = async () => {
		try {
			const products = await RNIap.getProducts(itemSkus);
			// if (Platform.OS === "ios") {
			// 	this.onPressSubscription(itemSkus[0]);
			// } else {
				this.onPressProduct(products[0].productId);
			//}
		} catch (err) {
			this.setState({
				purchaseIndicator: false,
				productList: products
			}, () => {
				console.warn(err.code, err.message);
			});
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

	// Purchase for android / iOS 
	getPurchases = async () => {
		this.setState({
			purchaseIndicator: true,
		}, () => {
			this.afterSetStateChangePurchase();
		});
	};

	afterSetStateChangeSubscription = async () => {
		const products = await RNIap.getSubscriptions(itemSubs);

		if (Platform.OS === "ios") {
			this.onPressSubscription(itemSubs[0]);
		} else {
			this.onPressSubscription(products[0].productId);
		}
	}

	// Subscription for android / iOS 
	// getSubscriptions = async () => {
	// 	try {
	// 		this.setState({
	// 			subscriptionIndicator: true,
	// 		}, () => {
	// 			this.afterSetStateChangeSubscription();
	// 		});
	// 	} catch (err) {
	// 		this.setState({
	// 			subscriptionIndicator: false,
	// 		}, () => {
	// 			console.warn(err.code, err.message);
	// 		});

	// 	}
	// };

	// onPressSubscription = async sku => {
	// 	try {
	// 		this.setState({
	// 			purchaseIndicator: false,
	// 			subscriptionIndicator: false,
	// 		});

	// 		const purchase = await RNIap.buySubscription(sku);

	// 		if (Platform.OS === "ios") {
	// 			this.receiptValidateIOS(purchase.transactionReceipt);
	// 		} else {
	// 			// Do stuff here for android server side validate receipt 
	// 		}
	// 	} catch (err) {
	// 		this.setState({
	// 			purchaseIndicator: false,
	// 			subscriptionIndicator: false,
	// 		}, () => {
	// 			Alert.alert("Inapp", err.message);
	// 		});
	// 	}
	// };

  goNext = () => {
    Alert.alert('Receipt', this.state.receipt);
  }
	onPressProduct = async sku => {
		try {
			this.setState({
				purchaseIndicator: false
			});
			const purchase = await RNIap.requestPurchase(sku);
			const transaction = JSON.parse(purchase.transactionReceipt);
			//if (Platform.OS === "android") {
				//this.onConsumeProduct(transaction);
				this.setState({ receipt: purchase.transactionReceipt }, () => this.goNext());
			// } else {
        	// 	this.receiptValidateIOS(purchase.transactionReceipt);
			// }
		} catch (err) {
			this.setState({
				purchaseIndicator: false
			}, () => {
				if (Platform.OS === "ios") {
					const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(
						async purchase => {
							subscription.remove();
						}
					);
				}
			});
		}
	};

	onConsumeProduct = async sku => {
		try {
			await RNIap.consumePurchase(sku.purchaseToken);
			// Do stuff here for server side validate receipt 
		} catch (err) {
			if (Platform.OS === "ios") {
				const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(
					async purchase => {
						subscription.remove();
					}
				);
			}
		}
	};

	// saveData = async (result) => {
	// 	try {
	// 		var countries = await AsyncStorage.getItem('key');
	// 		if (countries != null) {
	// 			countries = JSON.parse(countries)
	// 			if (!countries.includes(result)) {
	// 				countries.push(result)
	// 			}
	// 			this.setState({
	// 				validateItem: [],
	// 				validateItem: countries,
	// 			})
	// 		}
	// 		else {
	// 			let arrProduct = []
	// 			arrProduct.push(result)
	// 			this.setState({
	// 				validateItem: [],
	// 				validateItem: arrProduct,
	// 			})
	// 		}
	// 		console.log(this.state.validateItem);

	// 		AsyncStorage.setItem('key', JSON.stringify(this.state.validateItem));

	// 		console.log('success');
	// 	} catch (error) {
	// 		console.log('fail', error);

	// 	}
	// }

	// retriveData = async () => {
	// 	try {
	// 		var myArray = await AsyncStorage.getItem('key');
	// 		myArray = JSON.parse(myArray)
	// 		if (myArray !== null) {
	// 			this.setState({
	// 				validateItem: myArray
	// 			})
	// 			console.log(this.state.validateItem);
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }

	// receiptValidateIOS = async receipt => {
	// 	const receiptBody = {
	// 		"receipt-data": receipt,
	// 		password: "a740150a6e844879a53adcf1aacee812"
	// 	};
	// 	const result = await RNIap.validateReceiptIos(receiptBody, 1);
	// 	const product = result.receipt.in_app[0].product_id
	// 	this.setState({
	// 		validateItem: [...this.state.validateItem, result.receipt.in_app[0].product_id],
	// 		purchaseIndicator: false
	// 	})
	// 	this.saveData(result.receipt.in_app[0].product_id)
	// };
  requestPurchase = async(sku) => {
    try {
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
      
          <View style={styles.styleIcon}>
            
            <TouchableNativeFeedback
                onPress={this.getPurchases}
                style={styles.styleButton}>
              <Image
                //style={{width: 100, height: 100}}
                source={require('../images/purchase.png')}
              />
            </TouchableNativeFeedback>
          </View>
          
          <View style={{flex: 1}}>
            <TouchableNativeFeedback>
            
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    );
  }
};
