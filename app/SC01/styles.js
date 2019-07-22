import {
    StyleSheet,
    Dimensions, Platform
    } from 'react-native';
import {width, height, size} from '../config';
    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: '#333365',
            flexDirection: 'column'
        },
        upContainer: {
            flex : 1,
        },
        downContainer: {
            flex: 1,
        },
        styleimage: {
            marginTop: 0.1*height,
            justifyContent: 'center',
            alignItems: 'center',
        },
        strech: {
            width: 0.5*width,
            height: 0.3*height,
        },
        styleButton: {
            //marginTop: 0.15*height,
            justifyContent: 'center',
            alignItems: 'center',
        },
        styleIcon: {
            flex: 1,
            flexDirection:'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
            marginRight: 10,
        },
    });
    export default styles;