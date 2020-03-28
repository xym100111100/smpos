import { inject, observer } from "mobx-react";
import * as React from "react";
import { Image, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, GestureResponderEvent, Modal, View, ImageBackground, TouchableNativeFeedback, AsyncStorage } from 'react-native';
import { Button, Icon, SearchBar, Input } from 'react-native-elements';
import { NavigationScreenProp, TabRouter } from "react-navigation";
import ui from "../../../ui";
import { THEME_FOCUS_COLOR, THEME_HEADER_BACKGROUND_COLOR, THEME_PAGE_BACKGROUND_COLOR, THEME_TITLE_FONT_SIZE } from "../../assets/css/theme";
import CustomIcon from "../../assets/icon/CustomIcon";
import { VictoryLine, VictoryLabel, VictoryPie, VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';



import UserStore from "../../store/UserStore";
import ShopStore from "../../store/ShopStore";

import VipStore from "../../store/VipStore";
import KeyEvent from "../../../interaction/KeyEvent";
import Toast from "react-native-root-toast";
import { KEYCODE_ENTER } from "../../constant/AndroidKeyCode";
import CartStore from "../../store/CartStore";
import actions from "../../action";
import App1Sender from "../../../interaction/App1Sender";
import SaveOrderStore from "../../store/SaveOrderStore";
import { observable } from "mobx";

interface RevenuePageProps {
}

/**
 * 注入的属性(一般是inject进来的store中的状态，非HTML标签中设置)
 */
interface InjectedProps extends RevenuePageProps {
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

interface RevenuePageStates {
    revenueData: {
        date: string
    }[],

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
export default class RevenuePage extends React.Component<RevenuePageProps, RevenuePageStates> {
    keyEvent: KeyEvent | undefined;
    barCodeText: string = '';
    mySetTimeout: any = null;
    state = {
        revenueData: [{
            date: ''
        }]
    }
    /**
     * 读取注入的属性(一般是inject进来的store中的状态，非HTML标签中设置)
     */
    get injected() {
        return this.props as InjectedProps;
    }

    componentDidMount() {
        this.listRevenue()

    };
    componentWillUnmount() {

    };

    /**
     * 查询报表
     */
    listRevenue = () => {
        this.setState({
            revenueData: [
                {
                    'date': '第一天'
                },
                {
                    'date': '第二天'
                },
                {
                    'date': '第三天'
                },
            ]
        })
    }

    /**
     * 创建营收报表
     */
    creactRevenueTable = () => {
        const dom = this.state.revenueData.map((item) => {
            return (
                <Text key={item.date} >
                    {item.date}
                </Text>
            )
        })
        return dom;
    }



    render() {
        const { navigation, user, vip, cart, save } = this.injected;
        const data = [
            { x: '2020-3-16', y: 23.3 },
            { x: '2020-3-17', y: 65.4 },
            { x: '2020-3-18', y: 56 },
            { x: '2020-3-19', y: 89 },
            { x: '2020-3-20', y: 130 }
        ];
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
                    <Text style={styles.title}>微薄利商超收银系统-报表</Text>

                </View>
                <View style={styles.main}>
                    <View><Text>dddd</Text></View>
                    <View >

                        <VictoryChart
                            theme={VictoryTheme.material}
                        >
                            <VictoryLine
                                style={{
                                    data: { stroke: "#c43a31" },
                                    parent: { border: "1px solid #ccc" },
                                    labels: { fontSize: 15, fill: "#c43a31", padding: 15 },

                                }}
                            
                                data={data}
                                labels={({ datum }) => datum.y}
                         

                            />
                        </VictoryChart>

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
        backgroundColor: THEME_PAGE_BACKGROUND_COLOR,

    },



});