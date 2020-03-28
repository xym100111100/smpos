import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import Toast from "react-native-root-toast";
interface StepperProps {
    /** 数量的初始值 */
    initValue: number;
    /** 颜色 */
    color?: string;
    /** 尺寸 */
    size?: 's' | 'm' | 'l' | 'xl';
    /** 最小值 */
    minValue: number;
    /**
     * 改变数量的事件
     * @param value 改变后的值
     */
    onChanged: (value: number) => void;
}

interface StepperStates {

}

/**
 * 步进器
 */
export default class Stepper extends React.Component<StepperProps, StepperStates> {
    constructor(props: StepperProps) {
        super(props);
    }
    /** 
     * 处理改变值的函数
     * @param value 要改变的值
     */
    handleChanged(value: number) {
        const { minValue, onChanged } = this.props;

        requestAnimationFrame(() => {
            // 小于最小值，不改变
            // if (minValue > value) {
                
            //     return;
            // }

            // 触发属性中改变事件
            onChanged(value);
        });
    }
    render() {
        const {
            /** 颜色 */
            color,
            /** 尺寸大小 */
            size,
            /** 最小值 */
            minValue
        } = this.props;
        const {
            /** 当前值 */
            initValue
        } = this.props;
        // 是否禁用减号
        let isDisabledMinus = false;

        // 判断最小值，默认最小值是0
        const min = !minValue ? 0 : minValue;
        // 如果当前值是最小值
        if (initValue === min) {
            // 减号为灰色样式
            isDisabledMinus = true;
        }

        // 判断应用尺寸大小的样式
        let sizeStyles = mSizeStyles;
        if (size === 's') sizeStyles = sSizeStyles;
        else if (size === 'l') sizeStyles = lSizeStyles;
        else if (size === 'xl') sizeStyles = xlSizeStyles;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    disabled={isDisabledMinus}
                    style={[styles.button, sizeStyles.button]}
                    onPress={() => this.handleChanged(initValue - 1)}
                >
                    <Icon
                        type='antdesign'
                        name='minuscircleo'
                        iconStyle={[styles.buttonText, sizeStyles.buttonText, isDisabledMinus && styles.disabled, color && { color } || undefined]}
                    />
                </TouchableOpacity>
                <Text style={[styles.value, sizeStyles.value]}>{initValue}</Text>
                <TouchableOpacity
                    style={[styles.button, sizeStyles.button]}
                    onPress={() => this.handleChanged(initValue + 1)}
                >
                    <Icon type='antdesign' name='pluscircle' iconStyle={[styles.buttonText, sizeStyles.buttonText, color && { color } || undefined]} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        paddingVertical: 0,
    },
    disabled: {
        color: '#999'
    },
    buttonText: {
        color: '#f60',
        backgroundColor: 'white',
    },
    value: {
        fontWeight: 'bold',
    },
});

// 不同尺寸的样式
/** 小号 */
const sSizeStyles = StyleSheet.create({
    button: {
        marginRight: 3,
        marginVertical: 2,
    },
    buttonText: {
        fontSize: 30,
        borderRadius: 30,
    },
    value: {
        fontSize: 28,
        marginLeft: 2,
        marginRight: 4,
    },
});

/** 中号 */
const mSizeStyles = StyleSheet.create({
    button: {
        marginRight: 3,
        marginVertical: 2,
    },
    buttonText: {
        fontSize: 36,
        borderRadius: 36,
    },
    value: {
        fontSize: 32,
        marginLeft: 4,
        marginRight: 8,
    },
});

/** 大号 */
const lSizeStyles = StyleSheet.create({
    button: {
        marginRight: 5,
        marginVertical: 5,
    },
    buttonText: {
        fontSize: 40,
        borderRadius: 40,
    },
    value: {
        fontSize: 30,
        marginLeft: 5,
        marginRight: 10,
    },
});

/** 加大号 */
const xlSizeStyles = StyleSheet.create({
    button: {
        marginRight: 5,
        marginVertical: 5,
    },
    buttonText: {
        fontSize: 48,
        borderRadius: 48,
    },
    value: {
        fontSize: 48,
        marginLeft: 5,
        marginRight: 10,
    },
});
