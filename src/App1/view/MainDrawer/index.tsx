import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Image, ScrollView, StyleSheet, Alert, Text, RefreshControl, ActivityIndicator, TouchableWithoutFeedback, View, TouchableOpacity, AsyncStorage } from 'react-native';
import { THEME_PAGE_BACKGROUND_COLOR } from "../../assets/css/theme";

import { Button } from 'react-native-elements';
import { NavigationScreenProp, SafeAreaView } from 'react-navigation';
// import { DrawerItems} from 'react-navigation-drawer';
import ui from '../../../ui';
import { THEME_DRAWER_BACKGOUND_COLOR } from '../../assets/css/theme';
import UserStore from '../../store/UserStore';
import Toast from "react-native-root-toast";
import actions from "../../action";
import { array } from 'prop-types';

interface MainDrawerProps {
}

/**
 * 注入的属性(一般是inject进来的store中的状态，非HTML标签中设置)
 */
interface InjectedProps extends MainDrawerProps {
    /** react navigation的导航器 */
    navigation: NavigationScreenProp<any>;
    /** 用户信息 */
    user: UserStore;
}

// inject将需要在这里使用到的store注入到组件的属性中，方便读取
@inject(({ user }) => ({
    /** 用户信息 */
    user,
}))
@observer
export default class MainDrawer extends React.Component<MainDrawerProps> {
    /**
     * 读取注入的属性(一般是inject进来的store中的状态，非HTML标签中设置)
     */
    get injected() {
        return this.props as InjectedProps;
    }
    state = {
       
    }


 
    
    listRevenue = () => {
        const { navigation } = this.injected;
        navigation.closeDrawer()
        navigation.navigate('Revenue');
    }

    listOrder = () => {
        const { navigation } = this.injected;
        navigation.closeDrawer()
        navigation.navigate('Order');
    }

    goCheckoutpage=()=>{
        const { navigation } = this.injected;
        navigation.closeDrawer()
        navigation.navigate('Setting');
    }


    /**
     * 注销
     */
    cancellation = async () => {
        const { navigation } = this.injected;
        await AsyncStorage.removeItem("name");
        await AsyncStorage.removeItem('pwd');
        navigation.navigate('Login');
    }


    render() {
        const { ...props } = this.props;
        const { navigation, user } = this.injected;
        

        return (
            <ScrollView>
                <SafeAreaView style={styles.container} forceInset={{ top: 'never', horizontal: 'never' }}>
                    <View style={styles.modal}>
                        <View style={styles.modalLeft} >
                            <View style={styles.header}>
                                <Image style={styles.userImage} source={{ uri: user.faceAbsPath }} />
                                <Text style={styles.userInfo}>{user.nickname}</Text>
                                <Text style={styles.userInfo}>ID: {user.id}</Text>
                            </View>
                            <View style={styles.itemsWrapper}>
                                <TouchableOpacity onPress={() =>this.goCheckoutpage()} >
                                    <View style={styles.wrapperItems} >
                                        <Text style={styles.itemText}  >结账</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.listOrder} >
                                    <View style={styles.wrapperItems}  >
                                        <Text style={styles.itemText}   >订单</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.listRevenue} >
                                    <View style={styles.wrapperItems}  >
                                        <Text style={styles.itemText}   >报表</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.footer}>
                                <Button onPress={() => this.cancellation()} title="退出登录" />
                            </View>
                            <View style={styles.footer}>
                                <Button onPress={() => navigation.closeDrawer()} title="关闭" />
                            </View>
                        </View>
    
                    </View>
                    <TouchableWithoutFeedback onPress={() => navigation.closeDrawer()}>
                        <View style={styles.mask}></View>
                    </TouchableWithoutFeedback>
                </SafeAreaView>

            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    mask: {
        flex: 1,
    },
    modal: {
        backgroundColor: 'white',
        width: ui.screenWidth * 25 / 100,
        height: ui.screenHeight,
        flexDirection: 'row'
    },
    modalLeft: {
        width: ui.screenWidth * 25 / 100,
        backgroundColor: THEME_PAGE_BACKGROUND_COLOR,

    },
    header: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: THEME_DRAWER_BACKGOUND_COLOR,
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: 'white'
    },
    userInfo: {
        color: 'white'
    },


    modalRight: {
        backgroundColor: 'white',
        width: ui.screenWidth * 75 / 100,
        flexDirection: 'row'
    },
    rightOrder: {
        width: '68%',
        overflow: 'scroll',
        backgroundColor: THEME_PAGE_BACKGROUND_COLOR,
        marginLeft: '2%'
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
    orderText: {
        fontSize: 18,
        paddingHorizontal: 10
    },
    rightOrderDetail: {
        width: '28%',
        fontSize: 18,
        backgroundColor: THEME_PAGE_BACKGROUND_COLOR,
        marginLeft: '2%',
        paddingLeft: 5
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
    }
});