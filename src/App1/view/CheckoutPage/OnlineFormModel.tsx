import * as React from "react";
import { Input, Icon, ListItem } from 'react-native-elements';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, TouchableNativeFeedback, FlatList, Button, TextInput, Switch, Picker } from 'react-native';
import CartDetailMo from "../../mo/CartDetailMo";
import actions from "../../action";
import OnlineInPosMo from "../../mo/OnlineInPosMo";


interface OnlineFormModelProps {
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
     * 条码
     */
    barCode: string;

    /** 操作人 */
    opId: string;

    /** 店铺 */
    shopId: string;
}

interface OnlineFormModelStates {
    /** 库存 */
    stock: string,

    /** 条码 */
    code: string,

    /** 单位 */
    unit: string,

    /** 是否为称重商品 */
    weighGoods: boolean,

    /** 售价 */
    price: string,

    /** 分类 */
    classification: string,

    /** 名称 */
    name: string,

    /** 分类id */
    categoryId: string,


}

export default class OnlineFormModel extends React.Component<OnlineFormModelProps, OnlineFormModelStates> {
    constructor(props: OnlineFormModelProps) {
        super(props);
        this.state = {
            stock: '',
            code: this.props.barCode,
            unit: '个',
            weighGoods: false,
            price: '',
            classification: '默认分类',
            name: '',
            categoryId: '',
        }

    }

    componentDidMount() {
        this.getDetail();
    }
    componentWillUnmount() {

    }
    getDetail = () => {
        const { onlineAction } = actions;
        onlineAction.getPrdInfoByCode(this.props.barCode).then((ro: any) => {
            let categoryId = ro.categoryId ? ro.categoryId : '';
            let categoryName = ro.categoryName ? ro.categoryName : '';
            let prdProductSpecMo = ro.prdProductSpecMo;
            if (prdProductSpecMo != undefined && prdProductSpecMo != null) {
                this.setState({
                    unit: prdProductSpecMo.unit,
                    price: prdProductSpecMo.marketPrice + "",
                    classification: categoryName,
                    name: prdProductSpecMo.name,
                    categoryId: categoryId
                })
            }
        })
    }
    /**
     * 关闭窗体
     */
    closeModal = () => {

    }

    addOnline = () => {
        const { doSubmit, opId, shopId } = this.props;
        let online = new OnlineInPosMo();
        online.barcode = this.state.code;
        online.categoryId = this.state.categoryId;
        //online.categoryName = this.state.classification;
        online.categoryName = '默认分类';
        online.isWeighGoods = this.state.weighGoods;
        online.name = this.state.name;
        online.saleCount = this.state.stock;
        online.salePrice = this.state.price;
        online.saleUnit = this.state.unit;
        online.opId = opId;
        online.shopId = shopId;

        doSubmit(online);
    }

    render() {
        // modal初始化时候的top值 
        const { visible, children, doSubmit, title, doClose, ...restProps } = this.props;
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
                                    <View style={{ flex: 0, height: '5%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                        <Text style={{ fontSize: 30, fontWeight: 'bold', }}>{title}</Text>
                                    </View>
                                    <View style={{ flex: 0, height: '15%', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#CCC' }}>
                                        <Text style={{ fontSize: 22, }}>商品条码</Text>
                                        <View style={{ width: '2%' }}></View>
                                        <TextInput
                                            style={{ width: '80%', fontSize: 22 }}
                                            value={this.state.code}
                                            onChangeText={(text) => { this.setState({ code: text }) }}
                                            keyboardType="numeric"
                                            clearTextOnFocus={false}
                                            placeholder="请输入商品条码"
                                        />
                                    </View>
                                    <View style={{ flex: 0, height: '15%', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#CCC' }}>
                                        <Text style={{ fontSize: 22, }}>商品名称</Text>
                                        <View style={{ width: '2%' }}></View>
                                        <TextInput
                                            style={{ width: '80%', fontSize: 22 }}
                                            value={this.state.name}
                                            onChangeText={(text) => { this.setState({ name: text }) }}
                                            clearTextOnFocus={false}
                                            placeholder="请输入商品名称"
                                        />
                                    </View>
                                    <View style={{ flex: 0, height: '15%', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#CCC' }}>
                                        <Text style={{ fontSize: 22, }}>商品分类</Text>
                                        <View style={{ width: '2%' }}></View>
                                        <TextInput
                                            style={{ width: '80%', fontSize: 22 }}
                                            value={this.state.classification}
                                            onChangeText={(text) => { this.setState({ classification: text }) }}
                                            clearTextOnFocus={false}
                                            placeholder="请输入商品分类"
                                        />
                                    </View>
                                    <View style={{ flex: 0, height: '15%', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#CCC' }}>
                                        <Text style={{ fontSize: 22, }}>售价</Text>
                                        <View style={{ width: '2%' }}></View>
                                        <TextInput
                                            style={{ width: '35%', fontSize: 22 }}
                                            value={this.state.price}
                                            keyboardType="numeric"
                                            onChangeText={(text) => { this.setState({ price: text }) }}
                                            clearTextOnFocus={false}
                                            placeholder="请输入售价"
                                        />
                                        <Text style={{ fontSize: 22, }}>元</Text>
                                        <View style={{ width: '5%' }}></View>
                                        <Text style={{ fontSize: 22, }}>称重商品</Text>
                                        <View style={{ width: '5%' }}></View>
                                        <Switch value={this.state.weighGoods} onValueChange={(value) => this.setState({ weighGoods: value })} />
                                    </View>
                                    <View style={{ flex: 0, height: '15%', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#CCC' }}>
                                        <Text style={{ fontSize: 22, }}>库存</Text>
                                        <View style={{ width: '2%' }}></View>
                                        <TextInput
                                            style={{ width: '40%', fontSize: 22 }}
                                            keyboardType="numeric"
                                            value={this.state.stock}
                                            onChangeText={(text) => this.setState({ stock: text })}
                                            clearTextOnFocus={false}
                                            placeholder="请输入库存"
                                        />
                                        <Text style={{ fontSize: 22, }}>单位</Text>
                                        <View style={{ width: '2%' }}></View>
                                        <Picker
                                            selectedValue={this.state.unit}
                                            style={{ width: "30%", alignItems: 'center', justifyContent: 'center' }}
                                            onValueChange={(itemValue, itemIndex) =>
                                                this.setState({ unit: itemValue })
                                            }>
                                            <Picker.Item label="个" value="个" />
                                            <Picker.Item label="包" value="包" />
                                            <Picker.Item label="瓶" value="瓶" />
                                            <Picker.Item label="袋" value="袋" />
                                            <Picker.Item label="盒" value="盒" />
                                            <Picker.Item label="条" value="条" />
                                            <Picker.Item label="件" value="件" />
                                            <Picker.Item label="支" value="支" />
                                            <Picker.Item label="套" value="套" />
                                            <Picker.Item label="把" value="把" />
                                            <Picker.Item label="双" value="双" />
                                            <Picker.Item label="扎" value="扎" />
                                            <Picker.Item label="张" value="张" />
                                            <Picker.Item label="台" value="台" />
                                            <Picker.Item label="排" value="排" />
                                            <Picker.Item label="组" value="组" />
                                            <Picker.Item label="斤" value="斤" />
                                            <Picker.Item label="箱" value="箱" />
                                            <Picker.Item label="kg" value="kg" />
                                            <Picker.Item label="提" value="提" />
                                            <Picker.Item label="桶" value="桶" />
                                            <Picker.Item label="罐" value="罐" />
                                            <Picker.Item label="杯" value="杯" />
                                            <Picker.Item label="份" value="份" />
                                            <Picker.Item label="本" value="本" />
                                        </Picker>
                                    </View>
                                    <View style={{ flex: 0, height: '20%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                        <TouchableNativeFeedback onPress={() => this.addOnline()}>
                                            <View style={{ flex: 0, height: '70%', width: '25%', backgroundColor: '#0066FF', justifyContent: "center", alignItems: 'center' }}>
                                                <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 25, color: 'white' }}>确认并添加</Text>
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
        height: '85%',
        width: '60%',
        alignItems: 'center',
    },
    title: {
        fontSize: 20
    },



})
