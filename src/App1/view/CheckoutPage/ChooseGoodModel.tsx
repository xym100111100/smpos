import * as React from "react";
import ModalEx from "../../component/ModalEx";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import CartDetailMo from "../../mo/CartDetailMo";


interface ChooseGoodModelProps {
    /**
     * 关闭窗口的事件
     */
    doClose: () => void;
    /**
     * 提交事件
     */
    doSubmit: (payload: CartDetailMo) => void;
    /**
     * 窗口标题
     */
    title: string;
    /**
     * 是否可见
     */
    visible: boolean;

    cartDetailList: CartDetailMo[]

}



interface ChooseGoodModelStates {
    payload: {}
}


export default class ChooseGoodModel extends React.Component<ChooseGoodModelProps, ChooseGoodModelStates> {
    constructor(props: ChooseGoodModelProps) {
        super(props);
        this.state = {
            payload: {
                mobile: ''
            }
        }
    }

    componentDidMount() {

    }
    componentWillUnmount() {

    }

    /**
     * 构造数据
     */
    creatView = (payload: CartDetailMo[]) => {
        const { doSubmit } = this.props;
        const view = payload.map((item) => {
            return (
                <TouchableWithoutFeedback key={item.key} onPress={() => doSubmit(item)} >
                    <View style={styles.itemView} >
                        <View style={styles.goodName} >
                            <Text>商品名称:</Text>
                            <Text>{item.goodsName}</Text>
                        </View>
                        <View style={styles.goodName} >
                            <Text>售价:</Text>
                            <Text>{item.salePrice}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            )
        })
        return view;
    }

    render() {

        const { visible, children, cartDetailList, doSubmit, title, doClose, ...restProps } = this.props;

        return (
            <ModalEx title={title} doSubmit={() => null} doClose={doClose} visible={visible}  >
                {this.creatView(cartDetailList)}
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
        backgroundColor: '#999999',
        height: 40,
    },
    goodName: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
    }


})