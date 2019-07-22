import React, { Component } from "react";
import {
    AppRegistry,
    Alert,
    View,
    Text,
    DrawerLayoutAndroid,
    TouchableOpacity
} from 'react-native'

var data = [
    {question: '1 + 1 = 2', correct: 1},
    {question: '3 - 9 = 2', correct: 0},
    {question: '9 - 1 = 5', correct: 0},
    {question: '45 + 1 = 9', correct: 0},
    {question: '12 - 9 = 3', correct: 1},
    {question: '19 + 15 = 34', correct: 1},
    {question: '6 - 1 = 90', correct: 0},
    {question: '100 + 1 = 101', correct: 1},
    {question: '3 - 1 = 2', correct: 1},
    {question: '0 + 1 = 2', correct: 0}
];

let count = 0;
export default class FreakingMath extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: Math.floor((Math.random() * 10) + 1)
        }
    }

    _onFalse() {
        if (data[this.state.position].correct == 0) {
            count++;
            this.setState({
                position: Math.floor((Math.random() * 10) + 1)
            })
        } else {
            Alert.alert("You lose" + count);
            count = 0;
            this.setState({
                position: Math.floor((Math.random() * 10) + 1)
            })
        }
    }
    _onTrue() {
        if (data[this.state.position].correct == 1) {
            count++;
            this.setState({
                position: Math.floor((Math.random()*10) + 1)
            })
        } else {
            Alert.alert("You lose");
            count = 0;
            this.setState({
                position: Math.floor((Math.random()*10) + 1)
            })
        }
    }
    render() {
        return(
            <View style ={{flex: 1, backgroudColor: 'white'}}>
                <View style = {{flex : 1, backgroundColor: '#2ecc71', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>{data[this.state.position].question}</Text>
                </View>
                <View style={{flex: 1, backgroundColor: 'white', flexDirection: 'row'}}>
                    <TouchableOpacity onPress={this._onTrue} style={{flex: 1, backgroundColor: '#e67e22', justifyContent:'center'}}>
                        <Text style={{fontSize: 40, color : 'white', fontWeight: 'bold'}}>TRUE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onFalse} style={{flex: 1, backgroundColor: '#e74e3c', justifyContent:'center'}}>
                        <Text style={{fontSize: 40, color : 'white', fontWeight: 'bold'}}>FALSE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}