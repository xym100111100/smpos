import { Provider } from 'mobx-react';
import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import ui from '../ui';
import navigation from './navigation';
import stores from './stores';
import CheckoutPage from './view/CheckoutPage';
import LoginPage from './view/LoginPage';
import MainDrawer from './view/MainDrawer';
import RevenuePage from './view/RevenuePage';
import OrderPage from './view/OrderPage';

/** 首页的导航器 */
const MainDrawerNavigator = createDrawerNavigator(
    {
        Sale: {
            // title: '收银',
            screen: CheckoutPage,
        },
        Setting: {
            screen: CheckoutPage
        },
        Revenue: {
            screen: RevenuePage
        },
        Order: {
            screen: OrderPage,
  

        }
    }, {
        //  initialRouteName: 'Sale', 初始化就是第一个
        contentComponent: props => <MainDrawer {...props} />,
        drawerWidth: ui.screenWidth,
        drawerBackgroundColor: 'rgba(0,0,0,0)',

    }
);






/** 总的导航器 */
const AppNavigator = createStackNavigator(
    {
        Login: {
            screen: LoginPage,
        },
        Main: {
            screen: MainDrawerNavigator,
        },

    },
    {
        initialRouteName: 'Login',
        headerMode: 'none', // 不显示react-native的状态栏
    }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App1 extends React.Component {
    render() {
        return (
            <Provider {...stores}>
                {/* <Root> */}
                <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
                    {/* <StatusBar backgroundColor="red" /> */}
                    <AppContainer
                        ref={navigatorRef => {
                            navigation.setTopLevelNavigator(navigatorRef);
                        }}
                    />
                </SafeAreaView>
                {/* </Root> */}
            </Provider>
        );
    }
}
