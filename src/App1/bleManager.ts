import { Permission, Platform, PermissionsAndroid } from "react-native";
import { BleManager, State } from 'react-native-ble-plx';


/** 请求授权 */
async function requestPermission() {
    const permissions: Permission[] = ['android.permission.ACCESS_COARSE_LOCATION'];
    if (Platform.OS == 'android') {
        for (const permission of permissions) {
            const check = await PermissionsAndroid.check(permission);
            console.log(`permission ${permission} check ${check}`);
            if (!check) {
                await PermissionsAndroid.request(permission);
            }
        }
    }

}

/** 打开蓝牙 */
async function openBle() {
    const state = await this.bleManager.state();
    if (state == State.PoweredOff) {
        if (Platform.OS == 'android') {
            const enable = await this.bleManager.enable();
            console.log(await this.bleManager.state());
        } else if (Platform.OS == 'ios') {
            // ios不能直接打开，用对话框提示打开蓝牙
        }
    }
}

requestPermission();

const bleManager = new BleManager();
bleManager.startDeviceScan(null, null, async (error, device) => {
    if (error) return console.error(error);
    if (device && device.serviceUUIDs) {
        console.log(device);
        // // 打印设备名称
        // device.serviceUUIDs.forEach(value => {
        //     console.log(value);
        //     if (value === '00001811-0000-1000-8000-00805f9b34fb') {
        //         // Stop scanning as it's not necessary if you are scanning for one device.
        //         bleManager.stopDeviceScan();

        //         // Proceed with connection.
        //     }
        // });
    }
});

