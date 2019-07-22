import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TouchableHighlight, 
    Alert, 
    Dimensions, 
    BackHandler, 
    Image, Button 
} from 'react-native';
import styles from './styles';
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import Modal from "react-native-modal";
import RNIap, {
} from 'react-native-iap';

export default class Game extends Component {
    constructor(props) {
        super(props)
        this.state = {
          score: 0,
          math: '',
          result: '',
          result_show: '',
          loop: [],
          timeCounter: Dimensions.get('window').width,
          width_screen: Dimensions.get('window').width,
          heart: 1,
          status: true,
          modalVisible: false,
          productList: [],
        }
        this.initMath = this.initMath.bind(this);
        this.stopLoop = this.stopLoop.bind(this);
      } 
    
    componentDidMount() {
      this.initMath();
      this.countDown();
      const { navigation } = this.props;
      const heart = navigation.getParam('heart','NO-Lang');
      const productList = navigation.getParam('productList', 'NO-List');
      this.setState({
        heart: heart,
        productList: productList
      });
      const { itemSkus } = this.props;
    // try {
    //   const result = await RNIap.initConnection()
    //   console.log('initiated connection?', result)
    //   const consumed = await RNIap.consumeAllItems();
    //   console.log('consumed all items?', consumed)
    //   let products = await RNIap.getProducts(itemSkus);
    //   console.log('loaded products', products)
    // } catch (err) {
    //   console.warn(err);
    // }
    }

    initMath() {
      this.stopLoop();
      const list_oparetors_easy = ['+', '-'];
      const one = Math.floor(Math.random() * 10);
      const two = Math.floor(Math.random() * 10);
      const operator = list_oparetors_easy[Math.floor(Math.random() * list_oparetors_easy.length)];
      const result = eval('one ' + operator + ' two');
      const result_show = eval('result '+ list_oparetors_easy[Math.floor(Math.random() * list_oparetors_easy.length)] + ' Math.floor(Math.random() * 2)');
      this.setState({
        math: '' + one + operator + two + '=' + result_show,
        result: result,
        result_show: result_show,
      });
    }
    
    countDown() {
      const loop = setInterval(() => {
        if(this.refs.timeCounter){
          this.refs.timeCounter.measure((ox, oy, width, height) => {
            this.setState({timeCounter: width - this.state.width_screen/20});
          });
          if(this.state.timeCounter <= 0){
            this.setState({timeCounter: Dimensions.get('window').width});
            this.onTimeover();
            this.stopLoop();
            this.setState({score: 0});
          };
        }
      }, 100);
      this.setState({loop: [...this.state.loop, loop]});
    }
    
    stopLoop(){
      this.state.loop.forEach(function(loop){
        clearInterval(loop);
      });
    }
  
    onPressTouchableHighlight(boolean) {
      if (this.state.heart > 0) {
        this.setState({timeCounter: Dimensions.get('window').width});
        //this.stopLoop();
        if((this.state.result == this.state.result_show) == boolean){
          this.initMath();
          this.countDown();
          this.setState({
            score: this.state.score += 1
          })
        } else {
          Alert.alert('Opps',
          'Gem over, score: ' + this.state.score,
          [{text: 'Again'}]
        );
        // if (this.state.heart == 0) 
        // Alert.alert('Get more hearts', [{text: 'Yes'}])
        this.initMath();
        this.setState({
          heart: this.state.heart - 1,
          score: 0,
          })
        } 
      } else {
        this.setState({
          modalVisible: true
        })
      }
      
    }
  
    onTimeover() {
      this.state.loop.forEach(function(loop){
        clearInterval(loop);
      });
      // Alert.alert('Opps' + this.state.score,
      //   'Get more heart ',
      //   [{text: 'Again'}]
      // );
      // if (this.state.heart == 0) 
      // Alert.alert('Get more hearts', [{text: 'Yes'}])
      if (this.state.heart == 0) {
        this.setState({modalVisible: true})
      }
      else {
        this.initMath();
        this.setState({heart: this.state.heart - 1 })
        Alert.alert('Opps',
          'Gem over, score: ' + this.state.score,
          [{text: 'Again'}]
        );
      }
      
    }
  
    requestPurchase = async(sku) => {
      try {
        RNIap.requestPurchase(sku);
        
      } catch (err) {
        console.log(err.code, err.message);
      }
      this.setState({
        heart : this.state.heart + 5,
        
      })
    }

    renderModalContent = () => (
        this.state.productList.map((product, i) => {
          return (
            this.setState({ modalVisible: false,status: true }),
    
          this.requestPurchase(product.productId)
    );
  })
    );
    render() {
      return (
        <View initMath={this.initMath} style={{flex: 1}}>
          <Modal
          isVisible={this.state.modalVisible}
          backdropColor="#B4B3DB"
          backdropOpacity={0.8}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
          >
            <View style={styles.content}>
              <Text style={styles.contentTitle}>Hi 👋!</Text>
              <Button
                onPress={() => this.renderModalContent()}
                title="Get more hearts"
              />
            </View>
          </Modal>
          <View  style={{flex: 3, backgroundColor: '#169e86'}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row'}}>
                <Image
                  style={{width: 30, height: 30, marginTop: 5}}
                  source={require('../images/heart.png')}
                />
                <Text style={{fontSize:30, color: 'white'}}>{this.state.heart}</Text>
              </View>
              <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                  <Text style={{fontSize:30, color: 'white'}}>{this.state.score}</Text>
              </View>
              
            </View>
              
            <View ref="timeCounter" style={{width: this.state.timeCounter,height: 5, marginTop: 50, backgroundColor: '#ef3e3e'}}>
              
            </View>
            <View style={{height: 100, marginVertical: 180, marginHorizontal: 10}}>
              <Text style={{fontSize:50, color: 'white', textAlign: 'center'}} ref="math">{this.state.math}</Text>
            </View>
          </View>
          <View style={{flex: 1, backgroundColor: '#169e86', flexDirection: 'row',justifyContent: 'space-around', alignItems: 'center'}}>
            <View style={styles.button}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center', marginTop: 30}}
                onPress={() => this.onPressTouchableHighlight(true)}>
                <Image 
                  source={require('../images/true.png')}/>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center', marginTop: 30}}
                onPress={() => this.onPressTouchableHighlight(false)}>
                <Image 
                  source={require('../images/false.png')}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  };
    