import * as React from "react";
import { Input, Icon, ListItem } from 'react-native-elements';
import {Image, View, Text, StyleSheet, Modal, TouchableWithoutFeedback, TouchableNativeFeedback, FlatList, Button, TextInput, Switch, Picker } from 'react-native';



interface CodeModelProps {
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

interface CodeModelStates {
    


}

export default class CodeModel extends React.Component<CodeModelProps, CodeModelStates> {
    constructor(props: CodeModelProps) {
        super(props);
        this.state = {
           
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
            <Modal animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={() => doClose()}>
                <TouchableWithoutFeedback onPress={() => doClose()} >
                    <View style={styles.vipContainer} >
                        <TouchableWithoutFeedback onPress={() => null} >
                            <View style={styles.vipBox} >
                                <View style={{ flex: 0, width: '90%', flexDirection: 'column', justifyContent: 'center', }}>
                                    <View style={{ flex: 0, height: '5%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                        <Text style={{ fontSize: 30, fontWeight: 'bold', }}>{title}</Text>
                                    <Image  source={require('../../assets/img/code.png')} />
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
        backgroundColor: 'white',
        height: '85%',
        width: '60%',
        alignItems: 'center',
    },
    title: {
        fontSize: 20
    },



})
