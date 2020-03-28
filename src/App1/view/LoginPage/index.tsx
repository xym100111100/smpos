import { MD5 } from 'crypto-js';
import { inject, observer } from 'mobx-react';
import * as React from "react";
import { Image, KeyboardAvoidingView, StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import { NavigationScreenProp } from "react-navigation";
import ui from "../../../ui";
import actions from "../../action";
import { THEME_FORM_BACKGROUND_COLOR, THEME_INPUT_ICON_COLOR, THEME_LOGIN_LABEL_FONT_SIZE, THEME_LOGIN_TEXTINPUT_FONT_SIZE, THEME_LOGIN_TITLE_COLOR, THEME_LOGIN_TITLE_FONT_SIZE, THEME_PAGE_BACKGROUND_COLOR } from "../../assets/css/theme";
import LoadingStore from '../../store/LoadingStore';
import UserLoginMo from '../../mo/UserLoginMo';
import env from '../../env';

interface LoginPageProps {
}

/**
 * 注入的属性(一般是inject进来的store中的状态，非HTML标签中设置)
 */
interface InjectedProps extends LoginPageProps {
    /** react-navigation的导航对象 */
    navigation: NavigationScreenProp<any>;
    /** 是否正在登录 */
    isLogingIn: boolean;
}

interface LoginPageStates {
    /** 用户名称 */
    userName: string,
    /** 登录密码 */
    loginPswd: string,
    /** 是否设置焦点到登录密码输入框 */
    isFocusLoginPswd: boolean;
}

// inject将需要在这里使用到的store注入到组件的属性中，方便读取
@inject(({ loading }) => ({
    /**
     * 是否正在登录
     */
    isLogingIn: (loading as LoadingStore).all
}))
@observer
export default class LoginPage extends React.Component<LoginPageProps, LoginPageStates> {
    /**
     * 读取注入的属性(一般是inject进来的store中的状态，非HTML标签中设置)
     */
    get injected() {
        return this.props as InjectedProps;
    }
    constructor(props: Readonly<LoginPageProps>) {
        super(props);
        this.state = { userName: '', loginPswd: '', isFocusLoginPswd: false };
        this._bootstrapAsync();
    }
    /**
     * 从本地读取账号密码
     */
    _bootstrapAsync = async () =>{
        const name = await AsyncStorage.getItem("name");
        const pwd = await AsyncStorage.getItem("pwd");
        if(name !== null && name != "" && pwd !== null && pwd != "" ){
            this.setState({
                userName: name,
                loginPswd: pwd
            })
        }
    }
    /**
     * 处理登录事件
     */
    handleLogin = () => {
        const { userAction } = actions;
        let { userName, loginPswd } = this.state;
        const { navigation } = this.injected;

        // 去空格
        userName = userName.trim();
        loginPswd = loginPswd.trim();

        // 生产模式下要真正验证用户名和密码不能为空
        if (process.env.NODE_ENV === 'production') {
            if (userName === '' || loginPswd === '') {
                Toast.show('用户名称或登录密码不能为空！', { position: Toast.positions.TOP });
                return;
            }
        }
        let pwd= loginPswd
        loginPswd = MD5(loginPswd).toString();

        let login = new UserLoginMo();
        login.userName = userName;
        login.loginPswd = loginPswd;
        login.domianId = env.DOMAIN_ID;
        userAction.loginByUserName(login)
            .then(async msg => {
                // Toast.show(msg, { position: Toast.positions.TOP });

                //登录成功后将账号密码存入本地
                await AsyncStorage.setItem("name",userName);
                await AsyncStorage.setItem('pwd',pwd);

                Toast.show(msg, {});
                navigation.navigate('Main');
                this.setState({userName: '', loginPswd: ''})
            })
            .catch(error => {
                // Toast.show(error, { position: Toast.positions.TOP });
                Toast.show(error, {});
            });
    };
    render() {
        const { isLogingIn } = this.injected;
        const { userName, loginPswd } = this.state;
        return (
            <KeyboardAvoidingView style={styles.container}>
                <View style={styles.left}>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>微薄利商超收银系统</Text>
                    </View>
                    <View style={styles.qrcodeWrap}>
                        <Image style={styles.qrcode} source={require('../../assets/img/WblQrCode.png')} />
                        <Text style={styles.qrcodeText}>微信扫一扫，关注官方公众号</Text>
                    </View>
                </View>
                <View style={styles.main}>
                    <View>
                        <Input
                            shake
                            placeholder='用户名称'
                            rightIcon={{ type: 'antdesign', name: 'user', color: THEME_INPUT_ICON_COLOR }}
                            autoFocus={true}
                            returnKeyType="next"
                            value={userName}
                            onChangeText={text => { this.setState({ userName: text }); }}
                            onSubmitEditing={() => {
                                (this.refs.txtLoginPswd as HTMLInputElement).focus();
                            }}
                        />
                        <Input
                            ref="txtLoginPswd"
                            shake
                            placeholder='登录密码'
                            rightIcon={{ type: 'antdesign', name: 'lock', color: THEME_INPUT_ICON_COLOR }}
                            returnKeyLabel="登录"
                            secureTextEntry
                            value={loginPswd}
                            onChangeText={text => this.setState({ loginPswd: text })}
                            onSubmitEditing={this.handleLogin}
                        />
                    </View>
                    <View style={{ marginTop: 40 }}>
                        <Button
                            title="登录"
                            disabled={isLogingIn}
                            loading={isLogingIn}
                            style={[styles.btnLogin]}
                            onPress={this.handleLogin}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const qrcodeHeight = ui.screenHeight * 618 / 1000;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME_PAGE_BACKGROUND_COLOR,
        flexDirection: 'row',
    },
    left: {
        flex: 618,
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    main: {
        flex: 382,
        marginVertical: 30,
        marginHorizontal: 30,
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: THEME_FORM_BACKGROUND_COLOR,
    },
    titleWrapper: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    title: {
        fontSize: THEME_LOGIN_TITLE_FONT_SIZE,
        color: THEME_LOGIN_TITLE_COLOR,
    },
    qrcodeWrap: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    qrcode: {
        // width: qrcodeHeight,
        height: qrcodeHeight,
        resizeMode: 'contain'
    },
    qrcodeText: {
        fontSize: 20,
        padding: 5,
        color: '#999',
    },
    lblUserName: {
        fontSize: THEME_LOGIN_LABEL_FONT_SIZE,
    },
    txtUserName: {
        fontSize: THEME_LOGIN_TEXTINPUT_FONT_SIZE,
    },
    lblLoginPswd: {
        fontSize: THEME_LOGIN_LABEL_FONT_SIZE,
        marginTop: 20,
    },
    txtLoginPswd: {
        fontSize: THEME_LOGIN_TEXTINPUT_FONT_SIZE,
    },
    btnLogin: {
        marginTop: 40,
    },
});

