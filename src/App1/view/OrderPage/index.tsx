import { inject, observer } from "mobx-react";
import * as React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, View } from 'react-native';
import { ScrollView, Alert, RefreshControl } from 'react-native';
import { Icon } from 'react-native-elements';
import { THEME_FOCUS_COLOR, THEME_HEADER_BACKGROUND_COLOR, THEME_PAGE_BACKGROUND_COLOR, THEME_TITLE_FONT_SIZE } from "../../assets/css/theme";
import UserStore from "../../store/UserStore";
import ShopStore from "../../store/ShopStore";
import VipStore from "../../store/VipStore";
import KeyEvent from "../../../interaction/KeyEvent";
import Toast from "react-native-root-toast";
import CartStore from "../../store/CartStore";
import actions from "../../action";
import SaveOrderStore from "../../store/SaveOrderStore";
import { NavigationScreenProp } from 'react-navigation';

interface OrderPageProps {
}

/**
 * 注入的属性(一般是inject进来的store中的状态，非HTML标签中设置)
 */
interface InjectedProps extends OrderPageProps {
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
    shop: ShopStore,

}

interface OrderPageStates {
    OrderData: {
        date: string
    }[],
    isload: boolean,
    isFetching: boolean,
    data: {}[],
    orderDeital: any
    pageNum: number,
    selectionDetailInfo: any
}

@inject(({ user, cart, vip, save, shop }) => ({
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
export default class OrderPage extends React.Component<OrderPageProps, OrderPageStates> {



    keyEvent: KeyEvent | undefined;
    barCodeText: string = '';
    mySetTimeout: any = null;
    state = {
        OrderData: [{
            date: ''
        }],
        data: [{

        }],
        pageNum: 1,
        pageSize: 15,
        isFetching: false,
        orderDeital: [
            {
                id: 0,
                onlineTitle: '',
                buyPrice: 0,
                buyCount: 0,
            },

        ],
        selectionDetailInfo: {
            id: 0,
            orderCode: '',
            payMode: '微信记账',
            realMoney: 0,
            orderState: '',
        },
        isload: true
    }
    /**
     * 读取注入的属性(一般是inject进来的store中的状态，非HTML标签中设置)
     */
    get injected() {
        return this.props as InjectedProps;
    }

    componentDidMount() {
        this.onRefreshOrder()

    };







    /**
     * 显示确认弹窗
     */
    showAlert(done: string) {
        if (done === '退货') {
            Alert.alert('退货', '是否给该商品退货?',
                [
                    { text: "取消", onPress: this.oncancel },
                    { text: "确认", onPress: () => this.onconfirm('退货') },
                ]
            );
        } else if (done === '重新下单') {
            Alert.alert('下单', '是否重新下单该商品?',
                [
                    { text: "取消", onPress: this.oncancel },
                    { text: "确认", onPress: () => this.onconfirm('重新下单') },
                ]
            );
        } else if (done === '现金结账') {
            Alert.alert('结账', '是否使用现金给该商品结账?',
                [
                    { text: "取消", onPress: this.oncancel },
                    { text: "确认", onPress: () => this.onconfirm('现金结账') },
                ]
            );
        } else if (done === '已经签收') {
            Alert.alert('重新下单', '该商品已支付，是否退货且改为已下单?',
                [
                    { text: "取消", onPress: this.oncancel },
                    { text: "确认", onPress: () => this.onconfirm('重新下单') },
                ]
            );
        }

    }

    onconfirm = (done: string) => {
        const { orderAction } = actions;
        const { selectionDetailInfo } = this.state;
        if (done === '退货') {
            orderAction.posAgreetoarefund(selectionDetailInfo.id).
                then((result: any) => {
                    Toast.show(result.msg, { position: Toast.positions.TOP });
                }).catch((error: any) => {
                    Toast.show(error, { position: Toast.positions.TOP });
                });
        } else if (done === '现金结账') {
            const payWay = 1;
            orderAction.posPayOrder({
                payWay,
                id: selectionDetailInfo.id
            }).
                then((result: any) => {
                    Toast.show(result.msg, { position: Toast.positions.TOP });
                    // 这里设置定时器是因为即使去查询的话可能订单还是已下单状态
                    setTimeout(() => {
                        this.onRefreshOrder();
                    }, 1000);

                }).catch((error: any) => {
                    Toast.show(error, { position: Toast.positions.TOP });
                });
        } else if (done === '重新下单') {
            orderAction.orderAgain({
                id: selectionDetailInfo.id
            }).
                then((result: any) => {
                    Toast.show(result.msg, { position: Toast.positions.TOP });
                    this.onRefreshOrder();
                }).catch((error: any) => {
                    Toast.show(error, { position: Toast.positions.TOP });
                });
        } else {
            Toast.show("未知操作", { position: Toast.positions.TOP });
            return;
        }

    }

    oncancel = () => {
        Toast.show("取消", { position: Toast.positions.TOP });
    }




    onMomentumScrollEnd = (event: any) => {
        if (!this.state.isload) {
            Toast.show("没有更多了", { position: Toast.positions.TOP });
            return;
        }
        const { user } = this.injected;
        const { orderAction } = actions;
        const offsetY = event.nativeEvent.contentOffset.y; //滑动距离
        const contentSizeHeight = event.nativeEvent.contentSize.height; //scrollView contentSize高度
        const oriageScrollHeight = event.nativeEvent.layoutMeasurement.height; //scrollView高度
        // Toast.show(offsetY + oriageScrollHeight + ":" + contentSizeHeight, { position: Toast.positions.TOP });
        // 这里+10是不知道什么鬼情况，居然差了0.00000几的距离导致左边少于右边。
        if (offsetY + oriageScrollHeight + 10 >= contentSizeHeight) {
            orderAction.listOrder({
                userId: user.id,
                pageNum: this.state.pageNum + 1,
                pageSize: this.state.pageSize,
            }).then((ro: any) => {
                for (let i = 0; i < ro.list.length; i++) {
                    if (ro.list[i].orderState === -1) ro.list[i].orderState = '已作废';
                    if (ro.list[i].orderState === 1) ro.list[i].orderState = '已下单';
                    if (ro.list[i].orderState === 2) ro.list[i].orderState = '已支付';
                    if (ro.list[i].orderState === 3) ro.list[i].orderState = '已发货';
                    if (ro.list[i].orderState === 4) ro.list[i].orderState = '已签收';
                    if (ro.list[i].orderState === 5) ro.list[i].orderState = '已结算';
                    if (ro.list[i].orderState === 6) ro.list[i].orderState = '开始结算';
                }
                this.setState({
                    data: this.state.data.concat(ro.list),
                    pageNum: this.state.pageNum + 1,
                })
                if (ro.pageNum === ro.pages) {
                    this.setState({
                        isload: false
                    })
                } else {
                    this.setState({
                        isload: true
                    })
                }
            }).catch((error: any) => {
                Toast.show(error, { position: Toast.positions.TOP });
            });


        }

    }


    createOrderList = () => {
        const { data, selectionDetailInfo } = this.state;

        const dom = data.map((item) => {
            if (item.id === selectionDetailInfo.id) {
                return (
                    <TouchableOpacity key={item.id} onPress={() => this.getOrderDetail(item)}  >
                        <View style={styles.orderItem2} >
                            <Text style={styles.orderText} >{item.orderState}</Text>
                            <Text style={styles.orderText} >{item.orderCode}</Text>
                            <Text style={styles.orderText} >{item.orderTime}</Text>
                            <Text style={styles.orderText} >￥{item.realMoney}</Text>
                        </View>
                    </TouchableOpacity>
                )
            } else {
                return (
                    <TouchableOpacity key={item.id} onPress={() => this.getOrderDetail(item)}  >
                        <View style={styles.orderItem} >
                            <Text style={styles.orderText} >{item.orderState}</Text>
                            <Text style={styles.orderText} >{item.orderCode}</Text>
                            <Text style={styles.orderText} >{item.orderTime}</Text>
                            <Text style={styles.orderText} >￥{item.realMoney}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }

        })
        return dom;
    }


    createOrderDetail = () => {
        const { selectionDetailInfo, orderDeital } = this.state;
        if (selectionDetailInfo === null) {
            return (
                <View>
                    <View style={styles.detailInfo} >
                        <View style={styles.infoItem} >
                            <Text>商品明细</Text>
                            <Text>共{orderDeital.length}件</Text>
                        </View>
                        <View>
                            <View style={styles.infoItem} >
                                <Text>临时商品</Text>
                                <Text>￥0</Text>
                            </View>
                            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }} >
                                <Text>￥0*0</Text>
                            </View>
                        </View>
                        <View style={styles.infoItem} >
                            <Text>结算明细</Text>
                        </View>
                        <View style={styles.infoItem2} >
                            <Text>订单金额</Text>
                            <Text>￥0</Text>
                        </View>
                        <View style={styles.infoItem2} >
                            <Text>微信记账</Text>
                            <Text>￥0</Text>
                        </View>
                    </View>
                    {this.createButton()}
                </View>
            )
        } else {
            return (
                <View>
                    <View style={styles.detailInfo} >
                        <View style={styles.infoItem} >
                            <Text>商品明细</Text>
                            <Text>共{orderDeital.length}件</Text>
                        </View>
                        {this.orderDetailDom()}
                        <View style={styles.infoItem} >
                            <Text>结算明细</Text>
                        </View>
                        <View style={styles.infoItem2} >
                            <Text>订单金额</Text>
                            <Text>￥{selectionDetailInfo.realMoney}</Text>
                        </View>
                        <View style={styles.infoItem2} >
                            <Text>{selectionDetailInfo.payMode}</Text>
                            <Text>￥{selectionDetailInfo.realMoney}</Text>
                        </View>
                    </View>
                    {this.createButton()}
                </View>
            )
        }
    }

    createButton = () => {
        const { selectionDetailInfo } = this.state;
        if (selectionDetailInfo.orderState === '已下单') {
            return (
                <View style={styles.detailBottom} >
                    <TouchableWithoutFeedback onPress={() => this.showAlert('重新下单')}>
                        <View>
                            <Text style={styles.bottomButton} >重新下单</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.showAlert('现金结账')}>
                        <View>
                            <Text style={styles.bottomButton} >现金结账</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

            )
        } else if (
            selectionDetailInfo.orderState !== '已作废' &&
            selectionDetailInfo.orderState !== '已结算' &&
            selectionDetailInfo.orderState !== '开始结算'
        ) {
            return (
                <View style={styles.detailBottom} >
                    <TouchableWithoutFeedback onPress={() => this.showAlert('已经签收')}>
                        <View>
                            <Text style={styles.bottomButton} >重新下单</Text>
                        </View>

                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.showAlert('退货')}>
                        <View>
                            <Text style={styles.bottomButton} >退货</Text>
                        </View>

                    </TouchableWithoutFeedback>
                </View>
            )
        }

    }

    orderDetailDom = () => {
        const { orderDeital } = this.state;
        if (orderDeital.length > 0) {
            const dom = orderDeital.map((item) => {
                return (
                    < View key={item.id} >
                        <View style={styles.infoItem} >
                            <Text>{item.onlineTitle}</Text>
                            <Text>￥{item.buyPrice}</Text>
                        </View>
                        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }} >
                            <Text>￥{item.buyPrice}*{item.buyCount}</Text>
                        </View>
                    </View >
                )

            })
            return dom;
        }
    }


    /**
     * 获取订单详情
     */
    getOrderDetail = (obj: any) => {
        const { orderAction } = actions;
        let payWayText = '';
        if (obj.payWay === 1) payWayText = '现金支付';
        if (obj.payWay === 2) payWayText = '微信支付';
        if (obj.payWay === 3) payWayText = '支付宝支付';
        if (obj.payWay === 4) payWayText = 'v支付';
        this.setState({
            selectionDetailInfo: {
                id: obj.id,
                orderCode: obj.orderCode,
                payMode: payWayText,
                realMoney: obj.realMoney,
                orderState: obj.orderState
            }
        })

        orderAction.getOrderDetailByOrderId(obj.id).then((result: any) => {
            // Toast.show("获取订单成功", { position: Toast.positions.TOP });
            this.setState({
                orderDeital: result
            })
        }).catch((error: any) => {
            Toast.show(error, { position: Toast.positions.TOP });
        });

    }

    // 头部刷新
    onRefreshOrder = () => {
        const { orderAction } = actions;
        const { user } = this.injected;

        // 这里可以做下拉请求
        this.setState({
            isFetching: true,
        })

        orderAction.listOrder({
            userId: user.id,
            pageNum: 1,
            pageSize: this.state.pageSize,
        }).then((ro: any) => {
            if (ro.list && ro.list.length > 0) {

                for (let i = 0; i < ro.list.length; i++) {
                    if (ro.list[i].orderState === -1) ro.list[i].orderState = '已作废';
                    if (ro.list[i].orderState === 1) ro.list[i].orderState = '已下单';
                    if (ro.list[i].orderState === 2) ro.list[i].orderState = '已支付';
                    if (ro.list[i].orderState === 3) ro.list[i].orderState = '已发货';
                    if (ro.list[i].orderState === 4) ro.list[i].orderState = '已签收';
                    if (ro.list[i].orderState === 5) ro.list[i].orderState = '已结算';
                    if (ro.list[i].orderState === 6) ro.list[i].orderState = '开始结算';
                }

                this.setState({
                    data: ro.list,
                    pageNum: 1,
                    selectionDetailInfo: {
                        id: ro.list[0].id,
                        orderCode: ro.list[0].orderCode,
                        payMode: '微信记账',
                        realMoney: ro.list[0].realMoney,
                        orderState: ro.list[0].orderState,
                    }
                })
                // 获取第一个订单详情
                this.getOrderDetail(ro.list[0]);
                if (ro.pageNum === ro.pages) {
                    this.setState({
                        isload: false
                    })
                } else {
                    this.setState({
                        isload: true
                    })
                }
            }
        }).catch((error: any) => {
            Toast.show(error, { position: Toast.positions.TOP });
        });

        this.setState({
            isFetching: false,
        })

    };





    render() {
        const { navigation, user, vip, cart, save } = this.injected;
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
                    <Text style={styles.title}>微薄利商超收银系统-订单</Text>

                </View>
                <View style={styles.main}>
                    <View style={styles.modalRight}>

                        <ScrollView

                            onMomentumScrollEnd={this.onMomentumScrollEnd}
                            style={styles.rightOrder}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isFetching}
                                    onRefresh={this.onRefreshOrder}
                                    colors={['rgb(217, 51, 58)']}
                                />
                            }
                        >
                            {this.createOrderList()}
                        </ScrollView>
                        <View style={styles.rightOrderDetail} >
                            <View style={styles.detailInfo} >
                                <Text>订单号</Text>
                                <Text style={styles.orderCode} >{this.state.selectionDetailInfo.orderCode}</Text>
                            </View>

                            {this.createOrderDetail()}


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


    main: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: THEME_HEADER_BACKGROUND_COLOR,
    },




    detailInfo: {
        paddingHorizontal: 10,
        marginVertical: 10
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 60,
        borderTopColor: '#666',
        borderTopWidth: 1,
        borderStyle: 'solid',
        alignItems: 'center'

    },
    infoItem2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        alignItems: 'center'

    },
    detailBottom: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    bottomButton: {
        height: 50,
        width: 100,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#1e86e6',
        textAlign: 'center',
        lineHeight: 50,
        fontSize: 16
    },
    orderCode: {
        paddingLeft: 10
    },
    itemsWrapper: {
        flex: 1,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    wrapperItems: {
        height: 60,
        width: 60,
        backgroundColor: '#1e86e6',
        justifyContent: 'center'
    },

    itemText: {
        color: 'white',
        fontSize: 17,
        textAlign: 'center'
    },
    footer: {
        padding: 10,
    },
    exitText: {
        color: 'white'
    },

    orderText: {
        fontSize: 18,
        paddingHorizontal: 10
    },


    orderItem: {
        flexDirection: 'row',
        borderBottomColor: '#666',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        height: 80,
        alignItems: 'center'
    },
    orderItem2: {
        flexDirection: 'row',
        borderBottomColor: '#666',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        height: 80,
        alignItems: 'center',
        backgroundColor: '#1e86e6',
    },

    modalRight: {
        width: '98%',
        flexDirection: 'row',
        marginLeft: '1%'
    },
    rightOrder: {
        width: '71%',
        overflow: 'scroll',
        backgroundColor: THEME_PAGE_BACKGROUND_COLOR,
    },

    rightOrderDetail: {
        width: '32%',
        fontSize: 18,
        backgroundColor: THEME_PAGE_BACKGROUND_COLOR,
        paddingLeft: 5,
        marginLeft: '1%'
    },
});