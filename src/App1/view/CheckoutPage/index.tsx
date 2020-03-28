import { inject, observer } from "mobx-react";
import * as React from "react";
import { Image, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, GestureResponderEvent, Modal, View, ImageBackground, TouchableNativeFeedback, AsyncStorage } from 'react-native';
import { Button, Icon, SearchBar, Input } from 'react-native-elements';
import { NavigationScreenProp, TabRouter } from "react-navigation";
import ui from "../../../ui";
import { THEME_FOCUS_COLOR, THEME_HEADER_BACKGROUND_COLOR, THEME_PAGE_BACKGROUND_COLOR, THEME_TITLE_FONT_SIZE } from "../../assets/css/theme";
import CustomIcon from "../../assets/icon/CustomIcon";
import Stepper from "../../component/Stepper";
import VipModal from "./VipModal";
import MergePaymentModal from "./MergePaymentModal";
import TemporaryGoods from "./TemporaryGoods";
import LoadOrderModel from "./LoadOrderModel";
import ChooseGoodModel from "./ChooseGoodModel";
import Table from "../../component/Table";
import CartDetailMo from "../../mo/CartDetailMo";
import OrderMo from "../../mo/OrderMo";
import OrderDetailMo from "../../mo/OrderDetailMo";
import OnlineDetailMo from "../../mo/OnlineDetailMo";


import UserStore from "../../store/UserStore";
import ShopStore from "../../store/ShopStore";

import VipStore from "../../store/VipStore";
import { formatCurrency, calculationTwoNumber, formatStringToNumber } from "../../util/MoneyUtils";
import KeyEvent from "../../../interaction/KeyEvent";
import Toast from "react-native-root-toast";
import { KEYCODE_ENTER } from "../../constant/AndroidKeyCode";
import CartStore from "../../store/CartStore";
import actions from "../../action";
import ScanBarcodeRo from "../../ro/pos/ScanBarcodeRo";
import App1Sender from "../../../interaction/App1Sender";
import SaveOrderStore from "../../store/SaveOrderStore";
import OnlineSearchMo from "../../mo/OnlineSearchMo";
import SearchModel from "./SearchModel";
import CashReceiptModel from "./CashReceiptModel";
import WeighGoodsModel from "./WeighGoodsModel";
import DiscountModel from "./DiscountModel";
import { observable } from "mobx";
import OnlineFormModel from "./OnlineFormModel";
import OnlineInPosMo from "../../mo/OnlineInPosMo";

interface CheckoutPageProps {
}

/**
 * 注入的属性(一般是inject进来的store中的状态，非HTML标签中设置)
 */
interface InjectedProps extends CheckoutPageProps {
    /** react navigation的导航器 */
    navigation: NavigationScreenProp<any>;
    /** 用户信息 */
    user: UserStore;
    /** 购物车 */
    cart: CartStore,
    /** 会员信息 */
    vip: VipStore,
    /** 存单 */
    save: SaveOrderStore,
    /**店铺 */
    shop:ShopStore,

}

interface CheckoutPageStates {
    searchText: string,
    modalVisible: boolean,
    editModal: String,
    payOrderId: String,
    data: {
        key: string;
        id: string;
        goodsName: string;
        salePrice: number;
        buyCount: number;
        saleUnit: string;
        subTotal: number;
    }[],
    payItem: {
        index: number,
        isActive: boolean,
        itemName: string,
        imgPath: string,
    }[],
    defaultPayment: {
        index: number,
        isActive: boolean,
        itemName: string,
        imgPath: string,
    },
    cartDetailList: CartDetailMo[],
    searchList: Array<OnlineSearchMo>,
    goods: object,
    discount: number,
    saveOrderMoList: number,
}

@inject(({ user, cart, vip, save ,shop}) => ({
    /** 用户信息 */
    user,
    /** 购物车 */
    cart,
    /** 会员信息 */
    vip,
    /** 存单 */
    save,
    /** 店铺信息*/
    shop,
}))
@observer
export default class CheckoutPage extends React.Component<CheckoutPageProps, CheckoutPageStates> {
    keyEvent: KeyEvent | undefined;
    barCodeText: string = '';
    mySetTimeout: any = null;
    state = {
        cartDetailList: [],
        defaultPayment: {
            index: 2,
            isActive: false,
            itemName: '在线支付',
            imgPath: 'https://www.duamai.com/ise-svr/files/damaiQsmm/2018/10/09/19/37/AFB2DF928C4B4B07A7CB6F5D2393FFA9.jpg'
        },
        searchText: '',
        modalVisible: false,
        editModal: '',
        payOrderId: '',
        data: [
            { key: '1', id: '1', goodsName: '娃哈哈矿泉水娃哈哈矿泉水娃哈哈矿泉水娃哈哈矿泉水娃哈哈矿泉水娃哈哈矿泉水 550ml', salePrice: 1.5, buyCount: 3, saleUnit: '瓶', subTotal: 4.5 },
            { key: '2', id: '2', goodsName: '娃哈哈矿泉水 550ml', salePrice: 1.5, buyCount: 3, saleUnit: '瓶', subTotal: 4.5 },
            { key: '3', id: '3', goodsName: '娃哈哈矿泉水 550ml', salePrice: 150, buyCount: 3, saleUnit: '瓶', subTotal: 450 },
            { key: '4', id: '4', goodsName: '娃哈哈矿泉水 550ml', salePrice: 1.5, buyCount: 3, saleUnit: '瓶', subTotal: 4.5 },
            { key: '5', id: '5', goodsName: '娃哈哈矿泉水 550ml', salePrice: 1.60, buyCount: 3, saleUnit: '瓶', subTotal: 4.5 },
            { key: '6', id: '6', goodsName: '娃哈哈矿泉水 550ml', salePrice: 1.55, buyCount: 3, saleUnit: '瓶', subTotal: 4.65 },
            { key: '7', id: '7', goodsName: '娃哈哈矿泉水 550ml', salePrice: 1.60, buyCount: 3, saleUnit: '瓶', subTotal: 4.5 },
        ],
        payItem: [
            {
                index: 2,
                isActive: true,
                itemName: '在线支付',
                imgPath: ''
            },
            {
                index: 1,
                isActive: false,
                itemName: '现金记账',
                imgPath: ''
            },

        ],
        searchList: [],
        goods: {},
        discount: 0,
        saveOrderMoList: 0,
    }
    /**
     * 读取注入的属性(一般是inject进来的store中的状态，非HTML标签中设置)
     */
    get injected() {
        return this.props as InjectedProps;
    }
    static navigationOptions = {
        drawerLabel: '收银台',
        drawerIcon: ({ tintColor }: { tintColor: any }) => (
            <CustomIcon size={20} name={'checkout'} color={tintColor} />
        ),
    };
    componentDidMount() {
        this.keyEvent = new KeyEvent();
        this.keyEvent.onKeyUp(key => {
            // 在收银机的扫码设备上设置扫码输出方式为单个字符依次输出。
            // 这里设置的了定时器，下面要清除掉以免内存溢出。
            this.mySetTimeout = setTimeout(() => {
                this.scanBarcode();
                this.barCodeText = '';
            }, 500);
            this.barCodeText += key.text;
        });
        this.getOrderList();
        this.setApp2QRCodeUrl();
    };
    componentWillUnmount() {
        if (this.keyEvent) {
            this.keyEvent.removeKeyUp();
            this.keyEvent = undefined;
        }
        this.setApp2QRCodeUrl();

    };

        /**
     * 设置app2二维码的URL。
     * 该方法是进入该页面的时候设置app2的二维码，按理来说值只需要在componentDidMount里面执行就行了
     * ，但是在app使用的过程中偶尔会发现app2的二维码被改掉，没有找到原因，所以会在订单生成等时候会再调用该方法。
     */
    setApp2QRCodeUrl=()=>{
        const { shop} = this.injected;
       
        const url = "https://www.duamai.com/ord-svr/ord/order/payment-type?shopId="+shop.id;
        //  const url = "http://192.168.1.201/ord-svr/ord/order/payment-type?shopId="+shop.id;
        App1Sender.hello(url);

    }

    getOrderList = async () => {
        const { save } = this.injected;
        let saveList = await AsyncStorage.getItem('saveList');
        if (saveList !== null) {
            save.saveOrderMoList = JSON.parse(saveList);
            this.setState({
                saveOrderMoList: save.saveOrderMoList.length
            })
        } else {
            save.saveOrderMoList = observable([]);
            this.setState({
                saveOrderMoList: 0
            })
        }
    }

            
    /**   
     * 扫描条码
     */
    scanBarcode = () => {
        const { shop} = this.injected;
        clearTimeout(this.mySetTimeout);
        // 因为监听了整个页面，为了防止输入的时候也会去查询，需要判断是六位数以上纯数据再去查询。        
        if (this.state.editModal === '') {
            var reg = new RegExp("^[0-9]*$");
            const { cartAction } = actions;
            let a = this.barCodeText.trim() === '';
            let b = !reg.test(this.barCodeText);
            let c = this.barCodeText.trim().length < 6;

            // Toast.show("判断:"+a+b+c, { position: Toast.positions.TOP });
            if (this.barCodeText.trim() === '' || !reg.test(this.barCodeText) || this.barCodeText.trim().length < 6) {
                this.barCodeText = '';
                return;
            }
            cartAction.addToCartByBarcode(this.barCodeText,shop.id)
                .then((ro: ScanBarcodeRo) => {
                    // 没有找到商品
                    if (
                        ro != undefined
                        && !ro.onlineDetailList
                        && !ro.productDetailList
                    ) {
                        this.setState({ editModal: 'onlineForm' })
                        Toast.show("沒有找到商品，请联系管理员录入:", { position: Toast.positions.TOP });
                        return;
                    }
                    // 找到既有产品详情又有商品详情
                    if (
                        ro != undefined
                        && ro.onlineDetailList
                        && ro.onlineDetailList.length > 0
                        && ro.productDetailList
                        && ro.productDetailList.length > 0
                    ) {
                        Toast.show("请选择对应的商品", { position: Toast.positions.TOP });
                        // 构造产品信息
                        let cartDetailList = new Array();
                        ro.productDetailList.forEach(item => {
                            const cartDetail = new CartDetailMo();
                            cartDetail.key = item.productSpecId;
                            cartDetail.productSpecId = item.productSpecId;
                            cartDetail.productId = item.productId;
                            cartDetail.goodsName = item.spec;
                            cartDetail.saleUnit = item.saleUnit;
                            cartDetail.salePrice = item.salePrice;
                            cartDetail.buyCount = 1;
                            cartDetail.isTempGood = false;
                            cartDetail.barcode = item.barcode;
                            cartDetail.productDetail = item;
                            cartDetail.isWeighGoods = item.isWeighGoods;
                            cartDetailList.push(cartDetail)
                        });
                        // 构造上线信息
                        ro.onlineDetailList.forEach(item => {
                            const cartDetail = new CartDetailMo();
                            cartDetail.key = item.onlineSpecId;
                            cartDetail.onlineSpecId = item.onlineSpecId;
                            cartDetail.onlineId = item.onlineId;
                            cartDetail.goodsName = item.spec;
                            cartDetail.saleUnit = item.saleUnit;
                            cartDetail.salePrice = item.salePrice;
                            cartDetail.buyCount = 1;
                            cartDetail.isTempGood = false;
                            cartDetail.barcode = item.barcode;
                            cartDetail.onlineDetail = item;
                            cartDetailList.push(cartDetail)
                        });
                        // 设置状态
                        this.setState({
                            cartDetailList: []
                        }, () => {
                            this.setState({
                                cartDetailList
                            })
                        })


                        this.setState({
                            editModal: 'chooseGoodModel'
                        })
                        return;

                    }
                    // 找到的都是上线详情
                    if (
                        ro != undefined
                        && ro.onlineDetailList
                        && ro.onlineDetailList.length > 0
                    ) {
                        if (ro.onlineDetailList.length == 1) {
                            Toast.show("找到一条上线详情", { position: Toast.positions.TOP });
                            const cartDetail = new CartDetailMo();
                            cartDetail.key = ro.onlineDetailList[0].onlineSpecId;
                            cartDetail.onlineSpecId = ro.onlineDetailList[0].onlineSpecId;
                            cartDetail.onlineId = ro.onlineDetailList[0].onlineId;
                            cartDetail.goodsName = ro.onlineDetailList[0].spec;
                            cartDetail.saleUnit = ro.onlineDetailList[0].saleUnit;
                            cartDetail.salePrice = ro.onlineDetailList[0].salePrice;
                            cartDetail.buyCount = 1;
                            cartDetail.isTempGood = false;
                            cartDetail.barcode = ro.onlineDetailList[0].barcode;
                            cartDetail.onlineDetail = ro.onlineDetailList[0];
                            if (ro.onlineDetailList[0].isWeighGoods !== undefined && ro.onlineDetailList[0].isWeighGoods !== null) {
                                cartDetail.isWeighGoods = ro.onlineDetailList[0].isWeighGoods;
                            }
                            cartAction.addToCart(cartDetail);
                        } else {
                            let cartDetailList = new Array();
                            ro.onlineDetailList.forEach(item => {
                                const cartDetail = new CartDetailMo();
                                cartDetail.key = item.onlineSpecId;
                                cartDetail.onlineSpecId = item.onlineSpecId;
                                cartDetail.onlineId = item.onlineId;
                                cartDetail.goodsName = item.spec;
                                cartDetail.saleUnit = item.saleUnit;
                                cartDetail.salePrice = item.salePrice;
                                cartDetail.buyCount = 1;
                                cartDetail.isTempGood = false;
                                cartDetail.barcode = item.barcode;
                                cartDetail.onlineDetail = item;
                                cartDetail.isWeighGoods = item.isWeighGoods;
                                cartDetailList.push(cartDetail)
                            });
                            this.setState({
                                cartDetailList: []
                            }, () => {
                                this.setState({
                                    cartDetailList
                                })
                            })

                            Toast.show("请选择上线信息", { position: Toast.positions.TOP });
                            this.setState({
                                editModal: 'chooseGoodModel'
                            })
                        }

                    }
                    // 找到的都是产品详情
                    if (
                        ro != undefined
                        && ro.productDetailList
                        && ro.productDetailList.length > 0
                    ) {
                        if (ro.productDetailList.length == 1) {
                            Toast.show("该产品还未上线，请尽快上线。", { position: Toast.positions.TOP });
                            const cartDetail = new CartDetailMo();
                            cartDetail.key = ro.productDetailList[0].productSpecId;
                            cartDetail.productSpecId = ro.productDetailList[0].productSpecId;
                            cartDetail.productId = ro.productDetailList[0].productId;
                            cartDetail.goodsName = ro.productDetailList[0].spec;
                            cartDetail.saleUnit = ro.productDetailList[0].saleUnit;
                            cartDetail.salePrice = ro.productDetailList[0].salePrice;
                            cartDetail.buyCount = 1;
                            cartDetail.isTempGood = false;
                            cartDetail.productDetail = ro.productDetailList[0];
                            if (ro.productDetailList[0].isWeighGoods !== undefined && ro.productDetailList[0].isWeighGoods !== null) {
                                cartDetail.isWeighGoods = ro.productDetailList[0].isWeighGoods;
                            }
                            cartAction.addToCart(cartDetail);
                        } else {
                            Toast.show("请选择产品信息并尽快将该产品上线", { position: Toast.positions.TOP });

                            let cartDetailList = new Array();
                            ro.productDetailList.forEach(item => {
                                const cartDetail = new CartDetailMo();
                                cartDetail.key = item.productSpecId;
                                cartDetail.productSpecId = item.productSpecId;
                                cartDetail.productId = item.productId;
                                cartDetail.goodsName = item.spec;
                                cartDetail.saleUnit = item.saleUnit;
                                cartDetail.salePrice = item.salePrice;
                                cartDetail.buyCount = 1;
                                cartDetail.isTempGood = false;
                                cartDetail.barcode = item.barcode;
                                cartDetail.productDetail = item;
                                cartDetailList.push(cartDetail)
                            });
                            this.setState({
                                cartDetailList: []
                            }, () => {
                                this.setState({
                                    cartDetailList
                                })
                            })

                            this.setState({
                                editModal: 'chooseGoodModel'
                            })
                        }

                    }


                })
                .catch((error: any) => {
                    this.setState({ editModal: 'onlineForm' })
                    Toast.show(error, { position: Toast.positions.TOP });
                });
        }
    };

    /**
     * 改变称重数量
     */
    weightGoodsCount = (value: CartDetailMo, record: CartDetailMo) => {
        const { cartAction } = actions;
        if (value.buyCount === 0) {
            cartAction.delete(record.id)
            return;
        }

        record.buyCount = value.buyCount;
        // 刷新状态触发页面重新渲染
        cartAction.refresh()

        this.setState({ editModal: '' });
    }

    /**
     * 渲染购物车为空时候的视图
     */
    renderEmptyCart = () => {
        return (
            <React.Fragment>
                <View style={styles.emptyCartWrapper}>
                    <Image style={styles.emptyCartImage} source={require('../../assets/img/ScanQrCode.png')} />
                    <Text style={styles.emptyCartTitle}>扫码添加商品</Text>
                </View>
            </React.Fragment>
        );
    };
    /**
     * 渲染购物车不为空时候的视图
     */
    renderCart = () => {
        const { cart } = this.injected;
        const data = this.state.data;


        // const data = [
        //     { key: '1', id: '1', goodsName: '娃哈哈矿泉水娃哈哈矿泉水娃哈哈矿泉水娃哈哈矿泉水娃哈哈矿泉水娃哈哈矿泉水 550ml', salePrice: 1.5, buyCount: 3, saleUnit: '瓶', subTotal: 4.5 },
        //     { key: '2', id: '2', goodsName: '娃哈哈矿泉水 550ml', salePrice: 1.5, buyCount: 3, saleUnit: '瓶', subTotal: 4.5 },
        //     { key: '3', id: '3', goodsName: '娃哈哈矿泉水 550ml', salePrice: 150, buyCount: 3, saleUnit: '瓶', subTotal: 450 },
        //     { key: '4', id: '4', goodsName: '娃哈哈矿泉水 550ml', salePrice: 1.5, buyCount: 3, saleUnit: '瓶', subTotal: 4.5 },
        //     { key: '5', id: '5', goodsName: '娃哈哈矿泉水 550ml', salePrice: 1.60, buyCount: 3, saleUnit: '瓶', subTotal: 4.5 },
        //     { key: '6', id: '6', goodsName: '娃哈哈矿泉水 550ml', salePrice: 1.55, buyCount: 3, saleUnit: '瓶', subTotal: 4.65 },
        //     { key: '7', id: '7', goodsName: '娃哈哈矿泉水 550ml', salePrice: 1.60, buyCount: 3, saleUnit: '瓶', subTotal: 4.5 },
        // ];
        return (
            <Table<CartDetailMo>
                thFontSize={20}
                tdFontSize={20}
                lineHeight={100}
                columns={[
                    { name: 'goodsName', title: '商品名称', width: 46, textAlign: 'left' },
                    { name: 'salePrice', title: '售价', width: 14, textAlign: 'right', formatter: (value, record) => '￥' + formatCurrency(value) + (record.saleUnit ? `\n/` + record.saleUnit + '' : '') },
                    {
                        name: 'buyCount', title: '购买数量', width: 26, textAlign: 'center',
                        render: (value, record) => {
                            if (record.isWeighGoods && record.isWeighGoods !== null && record.isWeighGoods !== undefined) {
                                return (
                                    <View style={{ alignItems: 'center' }}>
                                        <TouchableNativeFeedback onPress={() => { this.setState({ editModal: 'weighGoodsModel', goods: record }) }}>
                                            <View style={{ backgroundColor: 'white', height: '80%', width: '80%', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 28, fontWeight: 'bold' }}>{record.buyCount}{record.saleUnit}</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                )
                            } else {
                                return (

                                    <View style={styles.buyCountStepperWrapper}>
                                        <Stepper
                                            color={THEME_FOCUS_COLOR}
                                            size='xl'
                                            minValue={0}
                                            initValue={value}
                                            onChanged={value => this.stepperChanged(value, record)}
                                        />
                                        {record.saleUnit && <Text style={styles.buyCountStepperSaleUnit}>{record.saleUnit}</Text>}
                                    </View>
                                )
                            }
                        }

                    },
                    { name: 'subTotal', title: '小计', width: 14, textAlign: 'right', formatter: (value) => '￥' + formatCurrency(value) },
                ]}
                data={cart.cartDetailList}
            // data={data}
            />
        );
    };

    /**
     * 记步器改变
     * 需要重新改变状态的值
     */
    stepperChanged = (buyCount: number, record: CartDetailMo) => {
        const { cartAction } = actions;
        if (buyCount === 0) {
            cartAction.delete(record.id)
            return;
        }

        record.buyCount = buyCount;
        // 刷新状态触发页面重新渲染
        cartAction.refresh()
    }

    /**
     * 渲染多功能按钮
     * @param title 按钮标题
     * @param iconName 图标名称
     * @param iconType 图标类型，如antdesign
     * @param disabled 是否禁用按钮
     */
    renderCmdButton = (title: string, iconName: string, iconType: string, disabled: boolean, showModel: ((event: GestureResponderEvent) => void)) => {
        const color = disabled ? '#eee' : 'white';
        return (
            <View style={styles.mainCmdButtonWrapper}>
                <Button
                    title={title}
                    disabled={disabled}
                    buttonStyle={styles.mainCmdButton}
                    titleStyle={{ ...styles.mainCmdButtonText, color }}
                    onPress={showModel}
                    icon={{
                        disabled,
                        name: iconName,
                        type: iconType,
                        size: 32,
                        color,
                    }}
                />
            </View>
        );
    }


    /** 
     * 设置会员信息
     */
    setVipInfo = (payload: any) => {
        const { vipAction } = actions;
        vipAction.setVipInfo(payload.mobile)
            .then((msg: any) => {
                Toast.show(msg, { position: Toast.positions.TOP });
                this.setState({ editModal: '' })
            })
            .catch((error: string) => {
                Toast.show(error, { position: Toast.positions.TOP });
            })
    }

    /**
     * 组合记账支付
     * １：将数据发送到后台，成功后清空购物车和会员。
     * 
     */
    mergePayment = (payload: any) => {
        const { cartAction, vipAction, orderAction } = actions;
        const { cart, vip } = this.injected;
        if (cart.totalSaleAmount === '0.') {
            Toast.show('金额为0，不能生成!', { position: Toast.positions.TOP });
            return;
        }
        if (formatStringToNumber(cart.totalSaleAmount) != (formatStringToNumber(payload.firstPayment.firstPaymentAmount) + formatStringToNumber(payload.towPayment.towPaymentAmount))) {
            Toast.show('结算金额与商品金额不相等，不能结算!', { position: Toast.positions.TOP });
            return;
        }
        const payItem = this.state.payItem.find((item) => item.isActive === true);
        if (payItem === undefined) {
            Toast.show('请选择支付方式', { position: Toast.positions.TOP });
            return;
        }
        // 构造参数
        const orderMo = new OrderMo();
        orderMo.totalSaleAmount = formatStringToNumber(cart.totalSaleAmount);
        orderMo.totalBuyCount = cart.totalBuyCount;
        orderMo.payWay = payItem.index;
        if (vip.vipMo && vip.vipMo.id) {
            orderMo.userId = vip.vipMo.id;
        }
        let orderDetailList = new Array();
        cart.cartDetailList.map((item) => {
            let orderDetailMo = new OrderDetailMo();
            orderDetailMo.goodName = item.goodsName;
            orderDetailMo.buyCount = item.buyCount;
            orderDetailMo.isTempGood = item.isTempGood;
            orderDetailMo.buyPrice = item.salePrice;
            if (item.onlineDetail && item.onlineDetail.onlineSpecId) {
                orderDetailMo.onlineSpecId = item.onlineDetail.onlineSpecId
            }
            if (item.productDetail && item.productDetail.productSpecId) {
                orderDetailMo.productSpecId = item.productDetail.productSpecId
            }
            orderDetailList.push(orderMo);
        })
        orderMo.details = orderDetailList;
        orderAction.order(orderMo).then((msg: any) => {
            // 显示结果
            Toast.show(msg, { position: Toast.positions.TOP });
            // 清空购物车
            cartAction.clearCart();
            //　清空会员
            vipAction.updateVipInfo();
            // 关闭窗口
            this.setState({ editModal: '' })

        }).catch((error: string) => {
            Toast.show(error, { position: Toast.positions.TOP });
        })


    }

    /**
     * 修改会员信息
     */
    updateVipInfo = () => {
        const { vipAction } = actions;
        vipAction.updateVipInfo();
        this.setState({ editModal: 'vipModal' })

    }

    /**
     * 临时模拟扫码支付,完善时可删除
     */
    shaoMa = () => {
        this.barCodeText = '6901285991219';
        this.scanBarcode();
    }

    /**
     * 临时模拟扫码支付,完善时可删除
     */
    shaoMa2 = () => {
        this.barCodeText = '6902538007169';
        this.scanBarcode();
    }

    /**
     * 选择支付方式
     */
    choosePayment = (i: number) => {
        let tempArr = [...this.state.payItem]
        tempArr.forEach(item => {
            if (item.index === i) {
                item.isActive = true;
            } else {
                item.isActive = false;
            }

        });
        //　如果是组合记账则渲染组合记账的窗口
        if (i === 4) {
            this.setState({
                editModal: 'mergePaymentModal',
                payItem: tempArr
            })
        } else {
            this.setState({
                payItem: tempArr
            })
        }
    }

    /**
     * 生成订单
     * １:添加一笔交易
     * 2:清空购物车
     * 3:清空会员
     * 
     */
    creatOrder = () => {
        const { cartAction, vipAction, orderAction } = actions;
        const { cart, user, vip } = this.injected;


        if (cart.totalSaleAmount === '0.') {
            Toast.show('金额为0，不能记账' + cart.totalSaleAmount, { position: Toast.positions.TOP });
            return;
        }

        const payItem = this.state.payItem.find((item) => item.isActive === true);
        if (payItem === undefined) {
            Toast.show('请选择支付方式', { position: Toast.positions.TOP });
            return;
        }

        // 构造参数
        const orderMo = new OrderMo();
        orderMo.totalSaleAmount = formatStringToNumber(cart.totalSaleAmount);
        orderMo.totalBuyCount = cart.totalBuyCount;
        orderMo.payWay = payItem.index;
        orderMo.isNowReceived = true;
        orderMo.isSgjz = true;
        orderMo.firstAmount = formatStringToNumber(cart.totalSaleAmount);
        orderMo.opId = user.id;
        if (vip.vipMo && vip.vipMo.id) {
            orderMo.userId = vip.vipMo.id;
        }
        orderMo.discountMoney = cart.totalDiscountAmount === 0 ? 0 : calculationTwoNumber(cart.totalSaleAmount,cart.totalDiscountAmount.toString(),"-");
        //   Toast.show('金额1:'+ orderMo.discountMoney, { position: Toast.positions.TOP });
        // if (orderMo.discountMoney > 0) {
        //     return;
        // }

        let orderDetailList = new Array();
        cart.cartDetailList.map((item) => {
            let orderDetailMo = new OrderDetailMo();
            orderDetailMo.goodName = item.goodsName;
            orderDetailMo.buyCount = item.buyCount;
            orderDetailMo.isTempGood = item.isTempGood;
            orderDetailMo.buyPrice = item.salePrice;
            if (item.onlineSpecId) {
                orderDetailMo.onlineSpecId = item.onlineSpecId
                orderDetailMo.onlineId = item.onlineId;
            }
            if (item.productSpecId) {
                orderDetailMo.productSpecId = item.productSpecId
                orderDetailMo.productId = item.productId;
            }

            orderDetailList.push(orderDetailMo);
        })

        orderMo.details = orderDetailList;
        orderAction.order(orderMo).then((result: any) => {
            // 显示结果
            //  Toast.show(msg, { position: Toast.positions.TOP });
            //Toast.show(result.payOrderId, { position: Toast.positions.TOP });

            if (payItem.index === 1) {
                Toast.show("现金记账成功", { position: Toast.positions.CENTER });
                // 清空购物车
                cartAction.clearCart();
                //　清空会员
                vipAction.updateVipInfo();
                // 关闭窗口
                this.setState({
                    editModal: '',
                })

            } else if (payItem.index === 2) {
                Toast.show("生成订单成功，请扫码支付。", { position: Toast.positions.CENTER, backgroundColor: '#1a6922', });
                // 清空购物车
                cartAction.clearCart();
                //　清空会员
                vipAction.updateVipInfo();

            }
            this.setApp2QRCodeUrl();

        }).catch((error: string) => {
            Toast.show(error, { position: Toast.positions.TOP });
        })
    }




    /**
     * 清空商品
     */
    cleanGoods = () => {
        const { cartAction } = actions;
        cartAction.clearCart();
        // 这是支付id为空
        this.setState({
            discount: 0
        })
        Toast.show("清空商品", { position: Toast.positions.TOP });


    }



    /**
     * 临时商品
     */
    submitGoods = (payload: any) => {
        const { cartAction } = actions;
        this.setState({ editModal: '' })
        let data = this.state.data;
        const id = data.length + 1;
        const cartDetail = new CartDetailMo();
        cartDetail.key = id + '';
        cartDetail.goodsName = payload.goodsName;
        cartDetail.salePrice = payload.goodsPrice;
        cartDetail.buyCount = 1;
        cartDetail.saleUnit = '个';
        cartDetail.isTempGood = true;
        cartDetail.isWeighGoods = false;
        cartAction.addToCart(cartDetail);
    }

    /**
     * 返回支付方式组件，是为了能在点击的时候改变被点击的
     * 支付方式的边框为显示
     */
    payItem = () => {

        const items = this.state.payItem.map(item => {
            if (item.isActive === false) {
                if (item.index === 1) {
                    return (
                        <TouchableWithoutFeedback key={item.index} onLongPress={() => this.setDefaultPayment(item.index)} onPress={() => this.choosePayment(item.index)} >
                            <View style={styles.rightPayItem}  >
                                <Image style={styles.rightVipImg} source={require('../../assets/img/cash.png')} />
                                <Text style={styles.rightPayItemText} >{item.itemName}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                } else if (item.index === 2) {
                    return (
                        <TouchableWithoutFeedback key={item.index} onLongPress={() => this.setDefaultPayment(item.index)} onPress={() => this.choosePayment(item.index)} >
                            <View style={styles.rightPayItem}  >
                            <Image style={styles.rightVipImg} source={require('../../assets/img/onlinepay.jpg')} />
                                <Text style={styles.rightPayItemText} >{item.itemName}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                } else if (item.index === 3) {
                    return (
                        <TouchableWithoutFeedback key={item.index} onLongPress={() => this.setDefaultPayment(item.index)} onPress={() => this.choosePayment(item.index)} >
                            <View style={styles.rightPayItem}  >
                                <Image style={styles.rightVipImg} source={require('../../assets/img/alipay.jpg')} />
                                <Text style={styles.rightPayItemText} >{item.itemName}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }



            } else {
                if (item.index === 1) {
                    return (
                        <TouchableWithoutFeedback key={item.index} onLongPress={() => this.setDefaultPayment(item.index)} onPress={() => this.choosePayment(item.index)} >
                            <View style={styles.rightPayItemActive}  >
                                <Image style={styles.rightVipImg} source={require('../../assets/img/cash.png')} />
                                <Text style={styles.rightPayItemText} >{item.itemName}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                } else if (item.index === 2) {
                    return (
                        <TouchableWithoutFeedback key={item.index} onLongPress={() => this.setDefaultPayment(item.index)} onPress={() => this.choosePayment(item.index)} >
                            <View style={styles.rightPayItemActive}  >
                            <Image style={styles.rightVipImg} source={require('../../assets/img/onlinepay.jpg')} />
                                <Text style={styles.rightPayItemText} >{item.itemName}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )

                } else if (item.index === 3) {
                    return (
                        <TouchableWithoutFeedback key={item.index} onLongPress={() => this.setDefaultPayment(item.index)} onPress={() => this.choosePayment(item.index)} >
                            <View style={styles.rightPayItemActive}  >
                                <Image style={styles.rightVipImg} source={require('../../assets/img/alipay.jpg')} />
                                <Text style={styles.rightPayItemText} >{item.itemName}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )
                }


            }

        })
        return items;

    }

    /**
     * 存单
     */
    saveOrder = () => {
        const { saveOrderAction, cartAction, vipAction } = actions;
        const { save } = this.injected;
        saveOrderAction.addToSaveOrder()
            .then((msg: any) => {
                cartAction.clearCart();
                Toast.show(msg, { position: Toast.positions.TOP });
                this.setState({ saveOrderMoList: save.saveOrderMoList.length });
            })
            .catch((error: string) => {
                Toast.show(error, { position: Toast.positions.TOP });
            })

        vipAction.updateVipInfo();
    }

    /**
     * 取单
     */
    loadOrder = (payload: any) => {
        const index = payload.index;
        const { save } = this.injected;
        const { cartAction, vipAction, saveOrderAction } = actions;
        // Toast.show('取单:' + save.saveOrderMoList.length, { position: Toast.positions.TOP });
        if (save.saveOrderMoList.length != 0) {
            const cartDetalMoList = save.saveOrderMoList[index].cartDetalMo;
            const vip = save.saveOrderMoList[index].vipMo
            //如果没存入会员则不登录
            if (save.saveOrderMoList[index].vipMo && save.saveOrderMoList[index].vipMo.id != undefined) {
                Toast.show('VIP:' + save.saveOrderMoList[index].vipMo.id);
                vipAction.setVipInfoById(save.saveOrderMoList[index].vipMo.id + '');
            }
            for (let i = 0; i < cartDetalMoList.length; i++) {
                let cartDetalMo = cartDetalMoList[i];
                let cartDetail = new CartDetailMo();
                //  Toast.show('取单:' + cartDetalMo.onlineSpecId, { position: Toast.positions.TOP });

                cartDetail.key = cartDetalMo.key;
                cartDetail.goodsName = cartDetalMo.goodsName;
                cartDetail.salePrice = cartDetalMo.salePrice;
                cartDetail.buyCount = cartDetalMo.buyCount;
                cartDetail.saleUnit = cartDetalMo.saleUnit;
                cartDetail.isWeighGoods = cartDetalMo.isWeighGoods;
                cartDetail.isTempGood = cartDetalMo.isTempGood;
                cartDetail.onlineSpecId = cartDetalMo.onlineSpecId
                cartDetail.onlineId = cartDetalMo.onlineId;
                cartDetail.productSpecId = cartDetalMo.productSpecId
                cartDetail.productId = cartDetalMo.productId;

                let onlinemo = new OnlineDetailMo();
                onlinemo.onlineSpecId = payload.id;
                onlinemo.onlineId = payload.onlineId;
                cartDetail.onlineDetail = onlinemo;

                cartAction.addToCart(cartDetail);
            }
            saveOrderAction.deleteOne(index);
        } else {
            Toast.show('没有存单', { position: Toast.positions.TOP });
        }
        this.setState({ editModal: '', saveOrderMoList: save.saveOrderMoList.length });
    }

    /**
     * 显示取单页面
     */
    showLoadOrder = () => {
        const { save, cart } = this.injected;
        if (cart.cartDetailList.length != 0) {
            Toast.show('当前购物车还有其他商品,请先清空购物车');
            return;
        }
        if (save.saveOrderMoList.length >= 2) {
            this.setState({ editModal: 'loadOrder' })
        } else {
            let payload = { index: 0 }
            this.loadOrder(payload);
        }

    }

    /**
     * 设置默认支付
     */
    setDefaultPayment = (index: number) => {
        // 如果是组合记账则不处理
        if (index === 4) return;
        let payItem = [...this.state.payItem]
        payItem.forEach(item => {
            if (item.index === index) {
                item.isActive = true;
            } else {
                item.isActive = false;
            }

        });
        const defaultPayment = this.state.payItem.find((item) => item.index === index);
        if (defaultPayment) {
            this.setState({
                defaultPayment,
                payItem,
            })
            Toast.show('设置默认支付成功', { position: Toast.positions.CENTER });
        }


    }

    /**
     * 现金记账计算器
     */
    showCalculator = () => {
        this.setApp2QRCodeUrl();
        const { cart } = this.injected;
        let item = this.state.payItem.find((item) => item.isActive === true);
        //判断是否为现金记账
        let index = item === undefined ? 0 : item.index;
        if (index === 1 && cart.totalSaleAmount !== '0.') {
            this.setState({ editModal: 'cashReceiptModel' });
        } else {
            this.creatOrder();
        }
    }

    /**
     * 显示折扣计算器
     */
    showDiscountModel = (edit: string, modalNumber: number) => {
        const { cart } = this.injected;
        if (cart.cartDetailList.length === 0) {
            Toast.show('购物车没有商品', { position: Toast.positions.TOP });
        } else if (modalNumber === this.state.discount) {
            cart.totalDiscountAmount = 0;
            this.setState({ discount: 0 });
        } else {
            this.setState({ editModal: edit });
        }
    }

    /**
     * 当前支付方式
     */
    currentPayment = () => {
        const { cart } = this.injected;
        let item = this.state.payItem.find((item) => item.isActive === true)
        let payment = item === undefined ? '记账' : item.itemName;
        let totalSaleAmount = cart.totalDiscountAmount === 0 ? cart.totalSaleAmount : cart.totalDiscountAmount + '';
        totalSaleAmount = totalSaleAmount.indexOf('.') === totalSaleAmount.length - 1 ? totalSaleAmount.substring(0, totalSaleAmount.length - 1) : totalSaleAmount;
        return payment + '¥' + totalSaleAmount;
    }


    /**
     * 搜索添加商品
     */
    addSearchGoods = (payload: any) => {
        const { cartAction } = actions;
        this.setState({ editModal: '' })
        const cartDetail = new CartDetailMo();
        cartDetail.key = payload.id;
        cartDetail.goodsName = payload.onlineSpec;
        cartDetail.salePrice = payload.salePrice;
        cartDetail.buyCount = 1;
        cartDetail.saleUnit = payload.saleUnit;
        cartDetail.isTempGood = false;
        cartDetail.isWeighGoods = payload.isWeighGoods;
        let onlinemo = new OnlineDetailMo();
        onlinemo.onlineSpecId = payload.id;
        onlinemo.onlineId = payload.onlineId;
        cartDetail.onlineDetail = onlinemo;

        cartDetail.onlineSpecId = payload.id;
        cartDetail.onlineId = payload.onlineId;
        cartAction.addToCart(cartDetail);
    }

    /**
     * 选择商品
     */
    chooseGood = (payload: CartDetailMo) => {
        const { cartAction } = actions;
        this.setState({
            editModal: ''
        })
        cartAction.addToCart(payload);
    }

    /**
     * 不允许操作
     */
    notAllowDone = (msg: string) => {
        Toast.show(msg, { position: Toast.positions.CENTER });
    }

    /**
     * 添加折扣金额
     */
    addDiscountAmount = (discountAmount: number) => {
        const { cart } = this.injected;
        cart.totalDiscountAmount = discountAmount;
        this.setState({ editModal: '' });
    }

    /**
     * 标记选择的折扣类型
     */
    showDiscount = () => {
        const { discount } = this.state;
        if (discount == 1) {
            return (
                <View style={styles.discount}>
                    <TouchableNativeFeedback onPress={() => { this.showDiscountModel('discountModel', 1); }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%', width: '30%', borderRadius: 10, borderWidth: 1, borderColor: '#1e86e6' }}>
                            <Icon type="antdesign" name="check" color='#1e86e6' />
                            <Text style={{ fontSize: 22 }}>折扣</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => { this.showDiscountModel('reductionModel', 2); }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '30%', borderRadius: 10, borderWidth: 1, borderColor: '#1e86e6' }}>
                            <Text style={{ fontSize: 22 }}>减免</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            )
        } else if (discount == 2) {
            return (
                <View style={styles.discount}>
                    <TouchableNativeFeedback onPress={() => { this.showDiscountModel('discountModel', 1); }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '30%', borderRadius: 10, borderWidth: 1, borderColor: '#1e86e6' }}>
                            <Text style={{ fontSize: 22 }}>折扣</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => { this.showDiscountModel('reductionModel', 2); }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%', width: '30%', borderRadius: 10, borderWidth: 1, borderColor: '#1e86e6' }}>
                            <Icon type="antdesign" name="check" color='#1e86e6' />
                            <Text style={{ fontSize: 22 }}>减免</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            )
        } else {
            return (
                <View style={styles.discount}>
                    <TouchableNativeFeedback onPress={() => { this.showDiscountModel('discountModel', 1); }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '30%', borderRadius: 10, borderWidth: 1, borderColor: '#1e86e6' }}>
                            <Text style={{ fontSize: 22 }}>折扣</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => { this.showDiscountModel('reductionModel', 2); }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '30%', borderRadius: 10, borderWidth: 1, borderColor: '#1e86e6' }}>
                            <Text style={{ fontSize: 22 }}>减免</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            )
        }
    }

    /**
     * 显示选择的折扣类型
     */
    choseDiscount = (modal: number) => {
        const { discount } = this.state;
        if (discount === modal) {
            this.setState({ discount: 0 });
        } else {
            this.setState({ discount: modal });
        }
    }

    /** 添加商品 */
    addOnline = (online: OnlineInPosMo) => {
        const { onlineAction } = actions;
        onlineAction.addOnlineInPos(online).then((msg: any) => {
            Toast.show(msg, { position: Toast.positions.TOP });
        })
            .catch((error: string) => {
                Toast.show(error, { position: Toast.positions.TOP });
            })
        this.setState({ editModal: '' });
    }

    render() {
        const { navigation, user, vip, cart, save ,shop } = this.injected;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.menu} >
                        <TouchableOpacity></TouchableOpacity>
                        <TouchableOpacity >
                            <TouchableOpacity onPress={() => {
                                Toast.show(`弹出菜单`, {});
                                navigation.openDrawer();
                            }}>
                            </TouchableOpacity>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.openDrawer()}  >
                            <Icon type="antdesign" name="menuunfold" color={THEME_FOCUS_COLOR} size={42} />
                            <Text style={styles.menuText}>更多功能</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>微薄利商超收银系统-收银台</Text>
                    {/* 搜索栏 */}
                    <View style={styles.searchbarWrapper} >
                        <TouchableNativeFeedback onPress={() => this.setState({ editModal: 'searchModel' })}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: 200 }} >
                                <Icon type="antdesign" name="search1" size={25} color='white' />
                                <Text style={{ textAlign: 'right', fontSize: 30, color: 'white', marginRight: 20 }}>搜索商品</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    <TouchableOpacity>
                        <View style={styles.userWrapper}>
                            <Text style={styles.userLabel}>当前值班：</Text>
                            <Image style={styles.userImage} source={{ uri: user.faceAbsPath }} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.main}>

                    <View style={styles.mainLeft}>
                        <View style={styles.mainCart}>
                            {(cart.cartDetailList.length <= 0) && this.renderEmptyCart()}
                            {(cart.cartDetailList.length > 0) && this.renderCart()}
                        </View>
                        <View style={styles.mainCmd}>
                            <VipModal
                                title="绑定会员"
                                visible={this.state.editModal === 'vipModal'}
                                doClose={() => this.setState({ editModal: '' })}
                                doSubmit={this.setVipInfo}
                            />
                            {this.state.editModal === 'mergePaymentModal' && (
                                <MergePaymentModal
                                    initPayment={this.state.defaultPayment.index}
                                    title="组合记账"
                                    visible={this.state.editModal === 'mergePaymentModal'}
                                    doClose={() => this.setState({ editModal: '' })}
                                    doSubmit={this.mergePayment}
                                    totalSaleAmount={cart.totalSaleAmount}
                                />
                            )}
                            {this.state.editModal === 'chooseGoodModel' && (
                                <ChooseGoodModel
                                    cartDetailList={this.state.cartDetailList}
                                    title="选择商品"
                                    visible={this.state.editModal === 'chooseGoodModel'}
                                    doClose={() => this.setState({ editModal: '' })}
                                    doSubmit={this.chooseGood}
                                />
                            )}
                            <TemporaryGoods
                                title="临时商品"
                                visible={this.state.editModal === 'temporaryGoods'}
                                doClose={() => this.setState({ editModal: '' })}
                                doSubmit={this.submitGoods}
                            />
                            {this.state.editModal === 'loadOrder' && (
                                <LoadOrderModel
                                    title="取单"
                                    visible={this.state.editModal === 'loadOrder'}
                                    doClose={() => this.setState({ editModal: '', saveOrderMoList: save.saveOrderMoList.length })}
                                    doSubmit={this.loadOrder}
                                    orderList={save}
                                />
                            )}
                            {this.state.editModal === 'searchModel' && (
                                <SearchModel
                                    title="商品搜索"
                                    visible={this.state.editModal === 'searchModel'}
                                    doClose={() => this.setState({ editModal: '' })}
                                    doSubmit={this.addSearchGoods}
                                />
                            )}
                            {this.state.editModal === 'cashReceiptModel' && (
                                <CashReceiptModel
                                    title="现金记账"
                                    visible={this.state.editModal === 'cashReceiptModel'}
                                    doClose={() => this.setState({ editModal: '' })}
                                    doSubmit={() => { this.creatOrder(); this.setState({ editModal: '' }) }}
                                    goodTotal={cart.totalSaleAmount}
                                />
                            )}
                            {this.state.editModal === 'weighGoodsModel' && (
                                <WeighGoodsModel
                                    title="称重商品"
                                    visible={this.state.editModal === 'weighGoodsModel'}
                                    doClose={() => this.setState({ editModal: '' })}
                                    doSubmit={(mo) => this.weightGoodsCount(mo, this.state.goods)}
                                    goods={this.state.goods}
                                />
                            )}
                            {this.state.editModal === 'discountModel' && (
                                <DiscountModel
                                    title="折扣"
                                    visible={this.state.editModal === 'discountModel'}
                                    doClose={() => this.setState({ editModal: '' })}
                                    doSubmit={(mo) => { this.addDiscountAmount(mo.salePrice); this.choseDiscount(1) }}
                                    goodTotal={cart.totalSaleAmount}
                                    isPercentage={true}
                                />
                            )}
                            {this.state.editModal === 'reductionModel' && (
                                <DiscountModel
                                    title="减免"
                                    visible={this.state.editModal === 'reductionModel'}
                                    doClose={() => this.setState({ editModal: '' })}
                                    doSubmit={(mo) => { this.addDiscountAmount(mo.salePrice); this.choseDiscount(2) }}
                                    goodTotal={cart.totalSaleAmount}
                                    isPercentage={false}
                                />
                            )}
                            {this.state.editModal === 'onlineForm' && (
                                <OnlineFormModel
                                    title="添加商品"
                                    visible={this.state.editModal === 'onlineForm'}
                                    doClose={() => this.setState({ editModal: '' })}
                                    doSubmit={(mo) => { this.addOnline(mo) }}
                                    barCode={this.barCodeText}
                                    opId={user.id}
                                    shopId={shop.id}
                                />
                            )}
                            {/* {this.renderCmdButton('生成订单', 'qrcode', 'antdesign', false,               
                                this.state.payItem.find((item) => item.isActive === true && item.index === 3) !== undefined ? () => this.setState({ editModal: 'cashReceiptModel' }) :
                                    () => this.creatOrder())} */}
                            {this.renderCmdButton('挂单', 'doubleright', 'antdesign', false, () => this.saveOrder())}
                            {this.renderCmdButton('取单(' + this.state.saveOrderMoList + ')', 'doubleleft', 'antdesign', false, () => this.showLoadOrder())}
                            {this.renderCmdButton('清空商品', 'close', 'antdesign', false, () => this.cleanGoods())}
                            {this.renderCmdButton('临时商品', 'plus', 'antdesign', false, () => this.setState({ editModal: 'temporaryGoods' }))}
                            {this.renderCmdButton('开钱箱', 'bank', 'antdesign', false, () => App1Sender.openDrawer())}
                            {/* {this.renderCmdButton('二维码', 'android', 'antdesign', false, () => {this.shaoMa()})} */}
                        </View>
                    </View>
                    <View style={styles.mainRight}>
                        <View style={styles.rightVip} >
                            <View>
                                <Image style={styles.rightVipImg} source={{ uri: vip.vipMo ? vip.vipMo.faceAbsPath : 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=581589389,4176489335&fm=26&gp=0.jpg' }} />
                            </View>
                            <View  >
                                <Text style={styles.rightVipText} onPress={this.updateVipInfo} >
                                    会员登录
                                </Text>
                            </View>
                            <View style={{ marginLeft: 10 }}  >
                                <Text style={styles.rightVipText} onPress={this.updateVipInfo} >
                                    >>>
                                </Text>
                            </View>
                        </View>
                        {this.showDiscount()}
                        <View style={styles.rightPay} >
                            {this.payItem()}
                        </View>
                        <View style={styles.rightConfirmPay}  >
                            <View style={styles.rightConfirmPayContent} >
                                <View  >
                                    <Text style={styles.rightConfirmPayInfoText} >
                                        {this.currentPayment()}
                                    </Text>
                                </View>
                                <View >
                                    <TouchableOpacity onPress={() => this.showCalculator()} >
                                        <Text style={styles.rightConfirmPayBtn} >确认结账</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

/** 多功能区域的宽度 */
const cmdWidth = 120;
/** 空购物车的图片高度 */
const emptyCartImageHeight = (ui.screenHeight - 100) * 700 / 1000;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: THEME_HEADER_BACKGROUND_COLOR,
        paddingHorizontal: 15,
        paddingTop: 5,
        paddingBottom: 5,
    },
    menu: {
        marginRight: 10,
        alignItems: 'center'
    },
    menuText: {
        fontSize: 11,
        color: THEME_FOCUS_COLOR
    },
    title: {
        color: 'white',
        fontSize: THEME_TITLE_FONT_SIZE,
        paddingHorizontal: 10,
    },
    searchbarWrapper: {
        flex: 1,
        alignItems: 'flex-end'
    },
    searchbarContainer: {
        width: ui.screenWidth * 382 / 1000,
        height: 30,
        marginHorizontal: 10,
    },
    searchbarInput: {
        padding: 0,
        margin: 0
    },
    searchbarIcon: {
        padding: 0,
        margin: 0
    },
    userWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userLabel: {
        color: THEME_FOCUS_COLOR,
        fontSize: 30,
    },
    userImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 3,
        borderColor: THEME_FOCUS_COLOR
    },
    main: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: THEME_HEADER_BACKGROUND_COLOR,
    },
    mainLeft: {
        flex: 680,
        flexDirection: 'row',
        backgroundColor: THEME_PAGE_BACKGROUND_COLOR,
        marginLeft: 10,
        marginRight: 5,
        marginBottom: 10,
    },
    /** 购物车区域 */
    mainCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: 20,
    },
    /** 购物车为空时的外 */
    emptyCartWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartTitle: {
        fontSize: 28,
    },
    emptyCartImage: {
        height: emptyCartImageHeight,
        resizeMode: 'contain',
    },
    /** 购买数量步进器的外层 */
    buyCountStepperWrapper: {
        alignItems: 'center',
    },
    /** 购买数量步进器的销售单位 */
    buyCountStepperSaleUnit: {
        marginTop: -13,
        marginLeft: -5,
        fontSize: 18,
    },
    /** 多功能区域 */
    mainCmd: {
        width: cmdWidth,
        // borderLeftWidth: 1,
        // borderLeftColor: THEME_SPLIT_COLOR,
    },
    mainCmdButtonWrapper: {
        marginTop: 10,
        marginRight: 10,
    },
    mainCmdButton: {
        flexDirection: 'column',
        paddingVertical: 10,
    },
    mainCmdButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    mainRight: {
        flex: 320,
        backgroundColor: THEME_PAGE_BACKGROUND_COLOR,
        marginLeft: 5,
        marginRight: 10,
        marginBottom: 10,
    },
    rightVip: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 64,
        borderWidth: 2,
        borderColor: THEME_HEADER_BACKGROUND_COLOR,
        borderStyle: 'solid',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        paddingBottom: 6,
    },
    rightVipImg: {
        width: 50,
        height: 50,
        borderRadius: 30,
        borderWidth: 2,
        marginRight: 10,
        marginLeft: 10,
    },
    rightVipText: {
        height: 52,
        lineHeight: 52,
        fontSize: 18
    },
    rightPay: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    rightPayItem: {
        alignItems: 'center',
        padding: 4,
        borderColor: '#ddd',
        borderStyle: 'solid',
        borderWidth: 1,
    },
    rightPayItemActive: {
        alignItems: 'center',
        borderColor: '#1e86e6',
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 4,
        borderRadius: 10,

    },
    rightPayItemText: {
        fontSize: 17,

    },
    rightConfirmPay: {
        flexGrow: 2,
        justifyContent: 'flex-end',
        paddingRight: 20,
        paddingBottom: 10,
    },
    rightConfirmPayContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
    },
    rightConfirmPayInfoText: {
        justifyContent: 'flex-start',
        height: 60,
        lineHeight: 60,
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: 22,
        color: 'red'
    },
    rightConfirmPayBtn: {
        justifyContent: 'center',
        height: 60,
        lineHeight: 60,
        backgroundColor: '#1e86e6',
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: 18,
        marginLeft: 10,
        color: 'white'
    },
    discount: {
        flex: 0,
        height: '10%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 4,
    }


});