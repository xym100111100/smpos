import * as React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, Modal, View } from 'react-native';
import { Button } from 'react-native-elements';

interface ModalExProps {
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
     * 确定按钮是否可见
     */
    submitBtn?: boolean;
    /**
     * 取消按钮是否可见
     */
    cancelBtn?:boolean;
}



interface ModalExStates {

}


export default class ModalEx extends React.Component<ModalExProps, ModalExStates> {
    constructor(props: ModalExProps) {
        super(props);

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
        const { visible, children, doSubmit,cancelBtn, submitBtn, doClose, title, ...restProps } = this.props;
        // modal初始化时候的top值 

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={() => doClose()}
            >
                <TouchableWithoutFeedback onPress={() => doClose()} >
                    <View style={styles.vipContainer} >
                        <TouchableWithoutFeedback onPress={() => null} >
                            <View style={styles.vipBox} >
                                <View style={styles.vipHeader}  >
                                    <Text style={styles.vipHeaderText}  >{title}</Text>
                                </View>
                                <View style={styles.vipContent} >
                                    {children}
                                </View>
                                <View style={styles.vipFooter} >
                                    {
                                        submitBtn === true && (
                                            <View style={styles.vipFooterBon}　>
                                                <Button
                                                    title="确认"
                                                    disabled={false}
                                                    onPress={doSubmit}
                                                />
                                            </View>
                                        )
                                    }
                                    {
                                        cancelBtn === true && (
                                            <View style={styles.vipFooterBon} >
                                                <Button
                                                    title="取消"
                                                    disabled={false}
                                                    onPress={doClose?() => doClose():()=>null}
                                                />
                                            </View  >
                                        )
                                    }
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
        backgroundColor: 'white',
        width: '50%',
        alignItems: 'center',
    },
    vipHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginBottom: 20,
        marginTop: 20,
    },
    vipHeaderText: {
        fontSize: 20,
    },
    vipContent: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    vipFooter: {
        marginTop: 25,
        marginBottom: 20,
        flexDirection: 'row',
        width: '40%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    vipFooterBon: {
        width: '40%'
    }
});
