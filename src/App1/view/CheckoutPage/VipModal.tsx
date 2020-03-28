import * as React from "react";
import ModalEx from "../../component/ModalEx";
import { Input } from 'react-native-elements';
import { View, Text, StyleSheet } from 'react-native';


interface VipModalProps {
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
}



interface VipModalStates {
    payload: {}
}


export default class VipModal extends React.Component<VipModalProps, VipModalStates> {
    constructor(props: VipModalProps) {
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
     * 关闭窗体
     */
    closeModal = () => {

    }
    render() {
        // modal初始化时候的top值 
        const { visible, children, doSubmit, title, doClose, ...restProps } = this.props;

        return (
            <ModalEx title={title} submitBtn={true} cancelBtn={true} doSubmit={() => doSubmit(this.state.payload)} visible={visible} doClose={doClose} >
                <View style={styles.itemView} >
                    <View style={styles.titleView} >
                        <Text style={styles.textClass}  >手机号</Text>
                    </View>
                    <View style={styles.inputView} >
                        <Input
                            placeholder='输入会员手机号'
                            onChangeText={text => {
                                this.setState({
                                    payload: {
                                        mobile: text
                                    }
                                })
                            }}
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
})