import * as React from "react";
import ModalEx from "../../component/ModalEx";
import { Input } from 'react-native-elements';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import Toast from "react-native-root-toast";
import { formatStringToNumber } from "../../util/MoneyUtils";

interface MergePaymentModalProps {
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
     * 由组件传进来其中一种默认记账方式
     */
    initPayment: number,
    /**
     * 结算总价,用来计算两个结账方式加起来应该等于该数字
     */
    totalSaleAmount: string,

}



interface MergePaymentModalStates {
    payItem: {
        index: number,
        isActive: boolean,
        itemName: string,
        imgPath: string,
    }[],
    defualtPayment: {
        index: number,
        itemName: string,
        isActive: boolean,
    }[],
    firstPaymentAmount: string,
    towPaymentAmount: string,

}


export default class MergePaymentModal extends React.Component<MergePaymentModalProps, MergePaymentModalStates> {
    constructor(props: MergePaymentModalProps) {
        super(props);
        this.state = {
            firstPaymentAmount: '',
            towPaymentAmount: '',
            defualtPayment: [
                {
                    index: 1,
                    itemName: '现金记账',
                    isActive: false,
                },
                {
                    index: 2,
                    itemName: '微信记账',
                    isActive: false,
                },
            ],
            payItem: [
                {
                    index: 1,
                    isActive: false,
                    itemName: '现金记账',
                    imgPath: 'http://www.xincainet.com/static/upfile/news/201601041714036573.png'
                },
                {
                    index: 2,
                    isActive: false,
                    itemName: '微信记账',
                    imgPath: 'http://p0.ifengimg.com/pmop/2018/0620/CF1CC58247BD6AFB99F792AB632D5F3DC7122A77_size7_w600_h375.jpeg'
                },
                {
                    index: 3,
                    isActive: false,
                    itemName: '支付宝记账',
                    imgPath: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567059753703&di=f3dc0c8d59d55fbc5c8790e90faeb162&imgtype=0&src=http%3A%2F%2Fpic13.qiyeku.com%2Fqiyeku_pic%2F2015%2F6%2F9%2Fliying17%2Fproduct%2Fproduct_pic%2Fimage%2F2015_06_22%2F20150622114139889.png'

                },
            ],
        }
    }

    componentDidMount() {
        const { initPayment } = this.props
        /**
         * 如果传进来的是现金或微信支付则什么都不做 
         */
        if (initPayment === 1 || initPayment === 2) return;

        let defualtPayment = [...this.state.defualtPayment];
        defualtPayment[defualtPayment.length - 1].itemName = '支付宝记账';
        defualtPayment[defualtPayment.length - 1].index = 3;
        this.setState({
            defualtPayment
        });
    }

    /**
    * 返回支付方式组件，是为了能在点击的时候改变被点击的
    * 支付方式的边框为显示
    */
    payItem = () => {
        const items = this.state.payItem.map(item => {
            if (item.isActive === false) {
                return (
                    <TouchableWithoutFeedback key={item.index} onPress={() => this.choosePayment(item.index)} >
                        <View style={styles.payItem}  >
                            <Image style={styles.itemImg} source={{ uri: item.imgPath }} />
                            <Text style={styles.payItemText} >{item.itemName}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )
            } else {
                return (
                    <TouchableWithoutFeedback key={item.index} onPress={() => this.choosePayment(item.index)} >
                        <View style={styles.payItemActive}  >
                            <Image style={styles.itemImg} source={{ uri: item.imgPath }} />
                            <Text style={styles.payItemText} >{item.itemName}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                )
            }

        })
        return items;
    };

    /**
     * 将正在输入金额的支付方式的
     * isActive 改为true，以便修改的时候
     * 将其去掉换成被修改的支付方式
     * 
     * 默认支付方式state和支付方式state都要改，
     * 前者是为了修改的时候知道是那个，后者是为了
     * 显示那个是正在修改的
     */
    focusPayment = (index: number) => {

        let defualtPayment = [...this.state.defualtPayment];
        defualtPayment.forEach((item, i) => {
            if (item.index === index) {
                item.isActive = true
            } else {
                item.isActive = false
            }
        });

        let payItem = [...this.state.payItem]
        payItem.forEach(item => {
            if (item.index === index) {
                item.isActive = true
            } else {
                item.isActive = false
            }
        });
        this.setState({
            defualtPayment,
            payItem
        });

    };




    /**
     * 选择支付方式
     */
    choosePayment = (index: number) => {
        //　如果没有方式被选择则返回
        if (!this.state.defualtPayment.find((item) => item.isActive === true)) {
            Toast.show("请先选择要被修改的方式", { position: Toast.positions.TOP });
            return;
        }
        // 如果选择的和本来的就有了就直接返回
        let defualtPayment = [...this.state.defualtPayment]
        let oldItem = defualtPayment.find((item) => item.index === index)
        if (oldItem) {
            Toast.show(oldItem.itemName + "已存在", { position: Toast.positions.TOP });
            return;
        }


        defualtPayment.forEach(item => {
            let NewItem = this.state.payItem.find((item) => item.index === index);
            if (item.isActive && NewItem) {

                item.index = NewItem.index;
                item.itemName = NewItem.itemName;
            };
        });

        let payItem = [...this.state.payItem]
        payItem.forEach(item => {
            if (item.index === index) {
                item.isActive = true;
            } else {
                item.isActive = false;
            }
        });
        this.setState({
            defualtPayment,
            payItem
        })

    }

    /**
     * 输入框改变
     */
    inputChange = (amount: string, index: number) => {
        const { totalSaleAmount } = this.props

        if (formatStringToNumber(amount) > formatStringToNumber(totalSaleAmount)) {
            Toast.show("输入金额大于总金额:" + totalSaleAmount, { position: Toast.positions.TOP });
            return;
        }
        let re = /^\d*\.{0,1}\d{0,2}$/;

        if (index === 1 && re.exec(amount) != null) {
            if (amount === '') {
                this.setState({
                    firstPaymentAmount: '',
                    towPaymentAmount: totalSaleAmount,
                })
                return;
            }
            let amount2 = (formatStringToNumber(totalSaleAmount) * 100 - formatStringToNumber(amount) * 100) / 100
            this.setState({
                firstPaymentAmount: amount.toString(),
                towPaymentAmount: amount2.toString(),
            })
        }

        if (index === 2 && re.exec(amount) != null) {
            if (amount === '') {
                this.setState({
                    firstPaymentAmount: totalSaleAmount,
                    towPaymentAmount: '',
                })
                return;
            }
            let amount1 = (formatStringToNumber(totalSaleAmount) * 100 - formatStringToNumber(amount) * 100) / 100
            this.setState({
                firstPaymentAmount: amount1.toString(),
                towPaymentAmount: amount.toString(),
            })
        }



    }


    render() {
        const { visible, children, doSubmit, title, doClose, ...restProps } = this.props;
        return (
            <ModalEx
                title={title}
                submitBtn={true}
                cancelBtn={true}
                doSubmit={
                    () => doSubmit({
                        firstPayment:
                        {
                            firstPaymentAmount: this.state.firstPaymentAmount,
                            firstPaymentPattern: this.state.defualtPayment[0].index
                        },
                        towPayment:
                        {
                            towPaymentAmount: this.state.towPaymentAmount,
                            towPaymentPattern: this.state.defualtPayment[1].index
                        }
                    })}
                visible={visible}
                doClose={doClose} >
                <View style={styles.itemView}>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', }} >
                        {this.payItem()}
                    </View>
                </View>
                <View style={styles.itemView}  >
                    <View style={styles.titleView} >
                        <Text style={styles.textClass}  >{this.state.defualtPayment[0].itemName}</Text>
                    </View>
                    <View style={styles.inputView} >
                        <Input
                            keyboardType={'numeric'}
                            placeholder={"请输入" + this.state.defualtPayment[0].itemName + "金额"}
                            onChangeText={(amount) => this.inputChange(amount, 1)}
                            onFocus={() => this.focusPayment(this.state.defualtPayment[0].index)}
                            value={this.state.firstPaymentAmount}
                        />
                    </View>
                </View>
                <View style={styles.itemView}  >
                    <View style={styles.titleView} >
                        <Text style={styles.textClass}  >{this.state.defualtPayment[1].itemName}</Text>
                    </View>
                    <View style={styles.inputView} >
                        <Input
                            keyboardType={'numeric'}
                            placeholder={"请输入" + this.state.defualtPayment[1].itemName + "金额"}
                            onChangeText={(amount) => this.inputChange(amount, 2)}
                            value={this.state.towPaymentAmount}
                            onFocus={() => this.focusPayment(this.state.defualtPayment[1].index)}

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




    pay: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    payItem: {
        alignItems: 'center',
        padding: 4,
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 1,
    },
    payItemActive: {
        alignItems: 'center',
        borderColor: '#f60',
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 4,

    },
    payItemText: {
        fontSize: 17,

    },
    itemImg: {
        width: 50,
        height: 50,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'red',
        marginRight: 10,
        marginLeft: 10,
    },
})