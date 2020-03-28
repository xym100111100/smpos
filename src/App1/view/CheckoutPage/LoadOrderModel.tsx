import * as React from "react";
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, Button } from 'react-native';
import SaveOrderStore from "../../store/SaveOrderStore";
import Toast from "react-native-root-toast";
import SaveOrderMo from "../../mo/SaveOrderMo";
import actions from "../../action";


interface LoadOrderModalProps {
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
     * 存单列表
     */
    orderList: SaveOrderStore

}



interface LoadOrderModalStates {
    index: number,
    /**
     * 
     */
    defualtList: {
        orderList: SaveOrderMo,
        isActive: boolean
    }[],
}


export default class LoadOrderModel extends React.Component<LoadOrderModalProps, LoadOrderModalStates> {
    constructor(props: LoadOrderModalProps) {
        super(props);
        this.state = {
            index: 0,
            defualtList: [{
                orderList: new SaveOrderMo(),
                isActive: false
            }]
        }
    }

    componentDidMount() {
        const { orderList } = this.props;
        let defualtList = [];
        for (let i = 0; i < orderList.saveOrderMoList.length; i++) {
            let list = {
                orderList: new SaveOrderMo(),
                isActive: false
            };
            list.isActive = false;
            list.orderList = { ...orderList.saveOrderMoList[i] };
            defualtList.push(list);
        }
        this.setState({
            defualtList: defualtList
        });
    }
    componentWillUnmount() {

    }
    /**
     * 订单列表
     */
    orderList = () => {
        const { defualtList } = this.state;
        let key = 0;
        //Toast.show('订单:' + defualtList.length,{ position: Toast.positions.TOP })
        const items = defualtList.map(item => {
            const index = key
            key++;
            if (item.isActive == false) {
                return (
                    <TouchableWithoutFeedback key={key} onPress={() => { this.setState({ index: index }); this.select(index) }}>
                        <View style={styles.payItem}>
                            <Text>{key}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )
            } else {
                return (
                    <TouchableWithoutFeedback key={key} onPress={() => { this.setState({ index: index }); this.select(index) }}>
                        <View style={styles.payItemActive}>
                            <Text>{key}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )
            }
        })
        return items;
    };
    select = (i: number) => {
        let tempArr = [...this.state.defualtList];
        let index = 0;
        tempArr.forEach(item => {
            if (index === i) {
                item.isActive = true;
            } else {
                item.isActive = false;
            }
            index++;
        });
        this.setState({
            defualtList: tempArr
        })
    }
    /**
     * 订单详情
     */
    orderdetail = () => {
        const { index } = this.state;
        //Toast.show('订单编号' + index)
        const { orderList } = this.props;
        if (orderList.saveOrderMoList.length != 0) {
            const orderCart = orderList.saveOrderMoList[index];
            const items = orderCart.cartDetalMo.map(item => {
                return (
                    <View key={item.key} style={styles.order}>
                        <View style={styles.ordername}>
                            <Text style={styles.ordername}>商品名称:</Text>
                            <Text style={styles.ordername}>{item.goodsName}</Text>
                        </View>
                        <View style={styles.orderNumber}>
                            <Text style={styles.ordername}>购买数量:</Text>
                            <Text style={styles.ordername}>{item.buyCount}</Text>
                        </View>
                        <View style={styles.orderNumber}>
                            <Text style={styles.ordername}>商品单价:</Text>
                            <Text style={styles.ordername}>{item.salePrice}</Text>
                        </View>
                    </View>
                )
            })
            return items;
        }
    }
    /**
     * 删除订单
     */
    delete = () => {
        const { saveOrderAction } = actions;
        const { index } = this.state;
        saveOrderAction.deleteOne(index);
        Toast.show('删除成功')

    }
    /**
     * 关闭窗体
     */
    closeModal = () => {

    }
    render() {
        // modal初始化时候的top值 
        const { visible, children, doSubmit, title, doClose, ...restProps } = this.props;


        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={() => doClose()}
            >
                <TouchableWithoutFeedback onPress={() => doClose()} >
                    <View style={styles.vipContainer} >
                        <TouchableWithoutFeedback onPress={() => null} >
                            <View style={styles.vipBox} >
                                <View style={styles.vipHeader}  >
                                    <Text style={styles.vipHeaderText}  >{title}</Text>
                                </View>
                                <View style={styles.direction}>
                                    <View style={styles.leftList}>
                                        <View style={styles.Content} >
                                            <Text style={styles.title}>订单编号:</Text>
                                            {this.orderList()}
                                        </View>
                                        <View style={styles.vipFooter} >
                                            <View style={styles.leftFooterBon}　>
                                                <Button
                                                    title="删除订单"
                                                    disabled={false}
                                                    onPress={() => { this.delete(); doClose() }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.separator} />
                                    <View style={styles.rightList}>
                                        <View style={styles.Content} >
                                            {this.orderdetail()}
                                        </View>
                                        <View style={styles.vipFooter} >
                                            <View style={styles.rightFooterBon}　>
                                                <Button
                                                    title="确认"
                                                    disabled={false}
                                                    onPress={() => doSubmit({
                                                        index: this.state.index
                                                    })}
                                                />
                                            </View>
                                            <View style={styles.rightFooterBon} >
                                                <Button
                                                    title="取消"
                                                    disabled={false}
                                                    onPress={() => doClose()}
                                                />
                                            </View>
                                        </View>
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
        backgroundColor: 'white',
        height: '80%',
        width: '60%',
        alignItems: 'center',
    },
    direction: {
        flexDirection: 'row'
    },
    leftList: {
        height: '100%',
        width: '40%',
        alignItems: 'center',
    },
    rightList: {
        height: '100%',
        width: '60%',
        alignItems: 'center',
    },
    vipHeader: {
        // backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginBottom: 20,
        marginTop: 20,
    },
    vipHeaderText: {
        fontSize: 20,
        // backgroundColor: 'blue',
    },
    Content: {
        width: '100%',
        height: '75%',
        fontSize: 22,
        // backgroundColor: 'yellow',
        // justifyContent: 'center',
    },
    vipFooter: {
        //backgroundColor: 'yellow',
        marginTop: 25,
        marginBottom: 20,
        flexDirection: 'row',
        width: '40%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftFooterBon: {
        width: '80%'
    },
    rightFooterBon: {
        width: '40%'
    },
    separator: {
        height: '90%',
        backgroundColor: '#000000',
        width: 1
    },
    subtitleView: {
        flexDirection: 'row',
        paddingLeft: 10,
        paddingTop: 5
    },
    ratingImage: {
        height: 19.21,
        width: 100
    },
    ratingText: {
        paddingLeft: 10,
        color: 'grey'
    },
    title: {
        fontSize: 20
    },
    payItem: {
        alignItems: 'center',
        padding: 4,
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
        width: "60%",
        height: '10%'
    },
    payItemActive: {
        alignItems: 'center',
        borderColor: '#f60',
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 4,
        width: "60%",
        height: '10%'
    },
    ordername: {
        fontSize: 20,
        flexDirection: 'row',
    },
    orderNumber:{
        flexDirection: 'row',
        fontSize: 20,
    },
    order:{
        flexDirection: 'column',
    }
});
