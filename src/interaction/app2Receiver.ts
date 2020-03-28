import { DeviceEventEmitter } from "react-native";
import { DataType, TransferData } from "./TransferData";

type Listener = (data: any) => void;

/**
 * App2接收器
 * 用此接收器接收App2发送过来的数据
 */
class App2Receiver {
    listenerMap = new Map<String, Set<Listener>>();
    constructor() {
        DeviceEventEmitter.addListener('callApp2', (data) => {
            const transferData = JSON.parse(data) as TransferData;
            const listeners = this.listenerMap.get(transferData.dataType);
            listeners && listeners.forEach(listener => {
                listener(transferData.data);
            });
        });
    }

    /**
     * 添加监听器
     * @param dataType 数据类型(根据数据类型判断交给哪些监听器处理) 
     * @param listener 接收的监听器
     */
    private addListener(dataType: String, listener: Listener) {
        let listeners = this.listenerMap.get(dataType);
        if (!!!listeners) {
            listeners = new Set<Listener>();
        }
        listeners.add(listener);
        this.listenerMap.set(dataType, listeners);
    }

    /**
     * 处理测试事件
     * @param listener 监听器
     * @param name 名称
     */
    onHello(listener: (name: String) => void) {
        this.addListener(DataType.hello, data => {
            listener(data);
        });
    }
}

const app2Receiver = new App2Receiver();

export default app2Receiver;
