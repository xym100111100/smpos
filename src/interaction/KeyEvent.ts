import { DeviceEventEmitter, EmitterSubscription } from 'react-native';

export interface Key {
    /** key的编码 */
    code: number;
    /** key的动作 */
    action: number;
    /** key的文本 */
    text: string;
    characters: string;
}

type Listener = (data: Key) => void;

/**
 * 键盘事件类
 *
 * 该类封装了键盘的3个主要是键
 * onkeyDown 键按下时产生
 * onKeyUp 键抬起时产生
 * onKeyMultiple 连续点击时产生
 * 每个KeyController组件中都有一个唯一的KeyEvent对象
 * updateState方法：用于更新当前组件是否处于激活状态
 * 处于激活状态的组件下的键盘事件才生效
 */
export default class KeyEvent {
    keyDownListener: EmitterSubscription | undefined;
    keyUpListener: EmitterSubscription | undefined;
    keyMultipleListener: EmitterSubscription | undefined;

    onKeyDown(listener: Listener) {
        this.removeKeyDown();
        this.keyDownListener = DeviceEventEmitter.addListener('onKeyDown', listener);
    }

    removeKeyDown() {
        if (this.keyDownListener) {
            this.keyDownListener.remove();
            this.keyDownListener = undefined;
        }
    }

    onKeyUp(listener: Listener) {
        this.removeKeyUp();
        this.keyUpListener = DeviceEventEmitter.addListener('onKeyUp', listener);
    }

    removeKeyUp() {
        if (this.keyUpListener) {
            this.keyUpListener.remove();
            this.keyUpListener = undefined;
        }
    }

    onKeyMultiple(listener: Listener) {
        this.removeKeyMultiple();
        this.keyMultipleListener = DeviceEventEmitter.addListener('onKeyMultiple', listener);
    }

    removeKeyMultiple() {
        if (this.keyMultipleListener) {
            this.keyMultipleListener.remove();
            this.keyMultipleListener = undefined;
        }
    }
}
