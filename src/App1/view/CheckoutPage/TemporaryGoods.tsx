import * as React from "react";
import ModalEx from "../../component/ModalEx";
import { Input, } from 'react-native-elements';
import { View, StyleSheet, Text, TextInput, Alert } from 'react-native';



interface TemporaryGoodsProps {
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

}



interface TemporaryGoodsStates {
    payload: {
        goodsPrice: string
        goodsName: string
    }
    name: string
    price: string

}


export default class TemporaryGoods extends React.Component<TemporaryGoodsProps, TemporaryGoodsStates> {
    constructor(props: TemporaryGoodsProps) {
        super(props);
        // const { initValue } = props;
        // this.state = { value: initValue };
        this.state = {
            payload: {
                goodsPrice: '',
                goodsName: '临时商品'
            },
            name: '临时商品',
            price: ''
        }
    }
    componentDidMount() {

    }
    componentWillUnmount() {

    }
    /**
     * 关闭窗体
     */
    closeModal = (fun: Function) => {

        alert("关闭窗口")
        this.setState({
            name: '临时商品',
            price: ''
        })
        fun();
    }
    submitModal = (fun: Function) => {        
        if (/^[0-9]+([.]\d{1,2})?$/.test(this.state.price)) {
            this.setState({
                name: '临时商品',
                price: ''
            })
            fun();
        } else {
            Alert.alert('单价错误', '小数超过两位')
        }
    }
    render() {
        // modal初始化时候的top值 
        const { visible, children, title, doClose, doSubmit, ...restProps } = this.props;

        return (
            <ModalEx submitBtn={true} cancelBtn={true}  title={title} doSubmit={() => this.submitModal(() => doSubmit({ goodsName: this.state.name, goodsPrice: this.state.price }))} visible={visible} doClose={doClose} >
                <View style={styles.itemView} >
                    <View style={styles.titleView} >
                        <Text style={styles.textClass}  >商品名称</Text>
                    </View>
                    <View style={styles.inputView} >
                        <Input
                            placeholder='输入商品名称'
                            onChangeText={(name) => {
                                this.setState({
                                    name: name
                                })
                            }}
                            value={this.state.name}
                        />
                    </View>
                </View>
                <View style={styles.itemView} >
                    <View style={styles.titleView} >
                        <Text style={styles.textClass}  >商品单价</Text>
                    </View>
                    <View style={styles.inputView} >
                        <Input
                            placeholder='请输入商品单价'
                            keyboardType={'numeric'}
                            onChangeText={(price) => {
                                const newPrice = price.replace(/[^\d.]+/, '');
                                this.setState({
                                    price: newPrice
                                })
                            }}
                            value={this.state.price}
                            autoFocus={true}
                        />
                    </View>
                </View>
            </ModalEx>
        )
    }
}
const styles = StyleSheet.create({
    itemView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    titleView: {
        width: '15%'
    },
    inputView: {
        width: '55%'
    },
    textClass: {
        fontSize: 18,
    },
});
