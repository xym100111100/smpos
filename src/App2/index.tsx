/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-root-toast';
import app2Receiver from '../interaction/app2Receiver';
import QRCode from 'react-native-qrcode-svg';
import { colors } from 'react-native-elements';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
export default class App2 extends React.Component<Props> {
    state = {
        msg: "https://www.duamai.com/ord-svr/ord/order/payment-type?shopId=-1",
       //msg:"www.baidu.com",
    }
    componentDidMount() {
        //console.log('App2 componentDidMount');

        // Toast.show("副屏componentDidMount", { position: Toast.positions.TOP });
        const myThis = this;
        app2Receiver.onHello(data => {
            //  console.log('App2 handle onHello');
            myThis.setState({ msg: data });
            //  Toast.show("接收到通知:\r\n" + data, { position: Toast.positions.TOP });
        });
    }
    render() {
        const { msg} = this.state;
        let logoFromFile = require('./onlinepay.jpg')

        return (
            <View style={styles.container}>
                <View style={styles.containerTop}  >
                    <Text style={styles.welcome}>
                        推荐使用微信支付：微信支付后每个商品将获得相应的积分，积分永久有效，且每天产生收益，可提现到个人账户！
                    </Text>
                </View>
                <View style={styles.containerBootom} >
                    <View style={styles.bootomItem} >
                        <View style={styles.itemQrcode} >
                            <QRCode
                                value={msg}
                                size={300}
                                logo={logoFromFile}
                                logoSize={80}
                            />
                        </View>
                    </View>
                </View>
               
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        
    },
    welcome: {
        margin: 10,
        fontSize: 30
    },
    containerTop: {
        width: '100%',
        height: '30%',
        fontSize: 30,

    },
    containerBootom: {
        width: '100%',
        flexDirection: 'row',
        justifyContent:'space-around'
    },
    bootomItem: {
        width: '30%',
        alignItems: 'center',
        margin:'5%'
        
    },
    itemQrcode:{
        backgroundColor:'white'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
