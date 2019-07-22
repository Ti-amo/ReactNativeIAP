import {
    StyleSheet,
    Dimensions, Platform
    } from 'react-native';
import {width, height, size} from '../config';
    const styles = StyleSheet.create({
        content: {
            backgroundColor: '#f28f43',
            padding: 22,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.1)',
          },
          contentTitle: {
            fontSize: 20,
            marginBottom: 12,
          },
          button: {
            width: 0.4*width,
            height: 0.2*height,
            margin: 2,
            borderRadius: 5,
            backgroundColor: '#d1cccc'
          },
    });
export default styles;