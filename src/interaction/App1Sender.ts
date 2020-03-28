/**
 * App1发送器
 * 用此发送器将数据发送给App2
 */
import { NativeModules } from 'react-native';
import { DataType, TransferData } from './TransferData';

function callApp2(data: TransferData) {
    NativeModules.App1Module.callApp2(JSON.stringify(data));
}

/** 打开钱柜 */
function openDrawer() {
    NativeModules.App1Module.openDrawer();
}

export default class App1Sender {
    static hello = (name: string): void => {
        callApp2({ dataType: DataType.hello, data: name });
    }
    static openDrawer = (): void => {
        openDrawer();
    }
}
