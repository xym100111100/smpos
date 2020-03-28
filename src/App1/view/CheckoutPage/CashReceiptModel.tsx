import * as React from "react";
import ModalEx from "../../component/ModalEx";
import { Input, ListItem } from 'react-native-elements';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, TouchableNativeFeedback, FlatList, Button } from 'react-native';
import { Icon, } from 'react-native-elements';
import App1Sender from "../../../interaction/App1Sender";

interface CashReceiptModelProps {
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
     * 商品总价
     */
    goodTotal: string;
}

interface CashReceiptModelStates {
    //收款
    receivables: string,
    //找零
    smallChange: number,
}

export default class CashReceiptModel extends React.Component<CashReceiptModelProps, CashReceiptModelStates> {
    constructor(props: CashReceiptModelProps) {
        super(props);
        this.state = {
            receivables: '0',
            smallChange: 0,
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
     * 计算器按钮
     */
    calculatorButton = (start: number, end: number) => {
        let i: number;
        let j: number[] = [];
        for (i = start; i <= end; i++) {
            j[i] = i;
        }
        const item = j.map(item => {
            return (
                <TouchableNativeFeedback key={item} onPress={() => { this.addReceivables(item) }}>
                    <View style={styles.keyboardColor}>
                        <Text style={styles.keyboardText}>{item}</Text>
                    </View>
                </TouchableNativeFeedback>
            )
        })
        return item;
    }

    /**
     * 增加收款
     */
    addReceivables = (single: number) => {
        const { receivables } = this.state;
        let addSingle = single === 13 ? '00' : '' + single;
        let newReceivables = receivables === '0' ? addSingle : receivables + addSingle;
        newReceivables = newReceivables === '00' ? '0' : newReceivables;
        this.setState({ receivables: newReceivables });
        this.calculation(newReceivables);
    }

    /**
     * 小数点
     */
    decimalPoint = () => {
        const { receivables } = this.state;
        let newReceivables = receivables.indexOf('.') === -1 ? receivables + '.' : receivables;
        this.setState({ receivables: newReceivables });
        this.calculation(newReceivables);
    }

    /**
     * 退格
     */
    backSpace = () => {
        const { receivables } = this.state;
        let newReceivables = receivables.substring(0, receivables.length - 1);
        newReceivables = newReceivables.length === 0 ? '0' : newReceivables;
        this.setState({ receivables: newReceivables });
        this.calculation(newReceivables);
    }

    /**
     * 计算
     */
    calculation = (receivables: string) => {
        const { goodTotal } = this.props;
        let collect = goodTotal.substring(0, goodTotal.length - 1);
        let smallChange = eval(receivables + '-' + collect);
        smallChange = smallChange > '0' ? smallChange : '0';
        this.setState({ smallChange: smallChange });
    }

    render() {
        // modal初始化时候的top值 
        const { visible, children, doSubmit, title, doClose, goodTotal, ...restProps } = this.props;
        let totalSaleAmount = goodTotal;
        totalSaleAmount = totalSaleAmount.indexOf('.') === totalSaleAmount.length - 1 ? totalSaleAmount.substring(0, totalSaleAmount.length - 1) : totalSaleAmount;
        return (
            <Modal animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={() => doClose()}>
                <TouchableWithoutFeedback onPress={() => doClose()} >
                    <View style={styles.vipContainer} >
                        <TouchableWithoutFeedback onPress={() => null} >
                            <View style={styles.vipBox} >
                                <View style={{ flex: 0, flexDirection: 'column', height: '30%', width: '90%', display: 'flex', alignContent: 'center' }}>
                                    <View style={styles.monitor}>
                                        <Text style={{ fontSize: 50 }}>¥{this.state.receivables}</Text>
                                    </View>
                                    <View style={styles.monitor}>
                                        <Text style={{ fontSize: 20, color: '#CCC' }}>应收¥{totalSaleAmount}</Text>
                                        <Text style={{ fontSize: 30, color: '#1e86e6', }}>找零¥{this.state.smallChange}</Text>
                                    </View>
                                </View>

                                <View style={{ flex: 0, flexDirection: 'row', height: '10%', width: '90%', display: 'flex', alignContent: 'center', }}>
                                    <View style={{ flex: 0, width: '25%', height: "90%", flexDirection: 'row', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#ccc' }}>
                                        <TouchableNativeFeedback key={20} onPress={() => { this.setState({ receivables: '10' }); this.calculation('10'); }}>
                                            <View style={{ flex: 0, width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                                <Text style={{ fontSize: 20, color: '#0066FF', }}>¥10</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                    <View style={{ flex: 0, width: '1%', height: "90%",}}/>
                                    <View style={{ flex: 0, width: '25%', height: "90%", flexDirection: 'row', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#ccc' }}>
                                        <TouchableNativeFeedback key={21} onPress={() => { this.setState({ receivables: '50' }); this.calculation('50'); }}>
                                            <View style={{ flex: 0, width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                                <Text style={{ fontSize: 20, color: '#0066FF', }}>¥50</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                    <View style={{ flex: 0, width: '1%', height: "90%",}}/>
                                    <View style={{ flex: 0, width: '25%', height: "90%", flexDirection: 'row', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#ccc' }}>
                                        <TouchableNativeFeedback key={22} onPress={() => { this.setState({ receivables: '100' }); this.calculation('100'); }}>
                                            <View style={{ flex: 0, width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                                <Text style={{ fontSize: 20, color: '#0066FF', }}>¥100</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                </View>

                                <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-start', height: '60%', }}>
                                    <View style={{ flex: 0, width: "75%", flexDirection: 'column', justifyContent: 'space-around' }}>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', borderTopWidth: 1, borderTopColor: '#ccc' }}>
                                            {this.calculatorButton(7, 9)}
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', borderTopWidth: 1, borderTopColor: '#ccc' }}>
                                            {this.calculatorButton(4, 6)}
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', borderTopWidth: 1, borderTopColor: '#ccc' }}>
                                            {this.calculatorButton(1, 3)}
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', borderTopWidth: 1, borderTopColor: '#ccc' }}>
                                            <TouchableNativeFeedback key={11} onPress={() => { this.decimalPoint() }}>
                                                <View style={styles.keyboardColor}>
                                                    <Text style={styles.keyboardText}>.</Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                            <TouchableNativeFeedback key={0} onPress={() => { this.addReceivables(0) }}>
                                                <View style={styles.keyboardColor}>
                                                    <Text style={styles.keyboardText}>0</Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                            <TouchableNativeFeedback key={13} onPress={() => { this.addReceivables(13) }}>
                                                <View style={styles.keyboardColor}>
                                                    <Text style={styles.keyboardText}>00</Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                        </View>
                                    </View>

                                    <View style={{ flex: 1, width: "25%", flexDirection: 'column', justifyContent: 'flex-start' }}>
                                        <View style={{ flex: 1, height: "25%", flexDirection: 'row', justifyContent: 'center', borderTopWidth: 1, borderTopColor: '#ccc' }}>
                                            <TouchableNativeFeedback key={12} onPress={() => { this.backSpace() }}>
                                                <View style={{ flex: 0, width: '100%', justifyContent: 'center', alignContent: 'center' }}>
                                                    <Icon type="antdesign" name="left" />
                                                </View>
                                            </TouchableNativeFeedback>
                                        </View>
                                        <View style={{ flex: 1, height: "25%", flexDirection: 'row', justifyContent: 'center', borderTopWidth: 1, borderTopColor: '#ccc' }}>
                                            <TouchableNativeFeedback key={10} onPress={() => { this.setState({ receivables: '0' }); this.calculation('0'); }}>
                                                <View style={{ flex: 0, width: '100%', justifyContent: 'center', alignContent: 'center' }}>
                                                    <Text style={styles.keyboardText}>清空</Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                        </View>

                                        <View style={{ flex: 0, height: "50%", flexDirection: 'row', width: '100%', justifyContent: 'flex-start', }}>
                                            <TouchableNativeFeedback key={12} onPress={() => { App1Sender.openDrawer(); doSubmit({}) }}>
                                                <View style={{ flex: 0, width: '100%', justifyContent: 'center', alignContent: 'center', backgroundColor: '#0066FF' }}>
                                                    <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 25, color: 'white' }}>确定</Text>
                                                </View>
                                            </TouchableNativeFeedback>
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
        flex: 0,
        justifyContent: 'center',
        backgroundColor: 'white',
        height: '90%',
        width: '40%',
        alignItems: 'center',


    },
    title: {
        fontSize: 20
    },
    monitor: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    keyboardText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 25
    },
    keyboardColor: {
        flex: 0,
        width: '33.3%',
        justifyContent: 'center',
        alignContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#CCC'
    }

})
