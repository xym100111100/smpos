import * as React from "react";
import ModalEx from "../../component/ModalEx";
import { Input, Icon, ListItem } from 'react-native-elements';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, TouchableNativeFeedback, FlatList, Button, TextInput } from 'react-native';
import App1Sender from "../../../interaction/App1Sender";
import CartDetailMo from "../../mo/CartDetailMo";

interface WeighGoodsModelProps {
    /**
     * 关闭窗口的事件
     */
    doClose: () => void;
    /**
     * 提交事件
     */
    doSubmit: (payload: object) => void;
    /**
     * 窗口标题
     */
    title: string;
    /**
     * 是否可见
     */
    visible: boolean;

    /**
     * 商品信息
     */
    goods: CartDetailMo;
}

interface WeighGoodsModelStates {
    /** 购买数量 */
    count: string,

    /** */
    totalPrice: string,
}

export default class WeighGoodsModel extends React.Component<WeighGoodsModelProps, WeighGoodsModelStates> {
    constructor(props: WeighGoodsModelProps) {
        super(props);
        this.state = {
            count: this.props.goods.buyCount + '',
            totalPrice: eval(this.props.goods.buyCount + '*' + this.props.goods.salePrice)
        }
    }

    componentDidMount() {

    }
    componentWillUnmount() {

    }
    /**
     * 关闭窗体
     */
    closeModal = () => {

    }

    /**
     * 计算
     */
    calculation = (text: string) => {
        const { goods } = this.props;
        if (text !== '') {
            let smallChange = eval(text + '*' + goods.salePrice);
            smallChange = smallChange > '0' ? smallChange : '0';
            this.setState({ totalPrice: smallChange });
        }
        this.setState({ count: text });
    }


    render() {
        // modal初始化时候的top值 
        const { visible, children, doSubmit, title, doClose, goods, ...restProps } = this.props;
        return (
            <Modal animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={() => doClose()}>
                <TouchableWithoutFeedback onPress={() => doClose()} >
                    <View style={styles.vipContainer} >
                        <TouchableWithoutFeedback onPress={() => null} >
                            <View style={styles.vipBox} >
                                <View style={{ flex: 0, width: '90%', flexDirection: 'column', justifyContent: 'center', }}>
                                    <View style={{ flex: 0, height: '15%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                        <Text style={{ fontSize: 30, fontWeight: 'bold', }}>{goods.goodsName}</Text>
                                    </View>
                                    <View style={{ flex: 0, height: '10%', }}></View>
                                    <View style={{ flex: 0, height: '15%', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#CCC' }}>
                                        <Text style={{ fontSize: 22, }}>商品重量</Text>
                                        <View style={{ width: '2%' }}></View>
                                        <TextInput
                                            style={{ width: '15%', fontSize: 22, textAlign: 'center' }}
                                            value={this.state.count}
                                            onChangeText={(text) => { this.calculation(text); }}
                                            keyboardType="numeric"
                                            clearTextOnFocus={true}
                                        />
                                        <View style={{ width: '2%' }}></View>
                                        <Text style={{ fontSize: 22, }}>{goods.saleUnit}</Text>
                                    </View>
                                    <View style={{ flex: 0, height: '10%', }}></View>
                                    <View style={{ flex: 0, height: '15%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#CCC' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 22, }}>本次单价</Text>
                                            <View style={{ width: '15%' }}></View>
                                            <Text style={{ fontSize: 22, }}>¥{goods.salePrice}</Text>
                                        </View>
                                        <View >
                                            <Text style={{ fontSize: 22, color: '#AAA' }}>小计¥{this.state.totalPrice}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex: 0, height: '30%', justifyContent: 'flex-end', alignItems: 'flex-end', }}>
                                        <TouchableNativeFeedback onPress={() => { let mo = new CartDetailMo; mo.buyCount = parseFloat(this.state.count); doSubmit(mo) }}>
                                            <View style={{ flex: 0, height: '50%', width: '25%', backgroundColor: '#0066FF', justifyContent: "center", alignItems: 'center' }}>
                                                <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 25, color: 'white' }}>确认</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    vipContainer: {
        backgroundColor: 'rgba(100,100,100,0.3)',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    vipBox: {
        flex: 0,
        backgroundColor: 'white',
        height: '70%',
        width: '60%',
        alignItems: 'center',
    },
    title: {
        fontSize: 20
    },



})
