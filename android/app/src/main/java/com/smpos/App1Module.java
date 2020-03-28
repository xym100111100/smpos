package com.smpos;

import android.content.ComponentName;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.sunmi.peripheral.printer.ICallback;
import com.sunmi.peripheral.printer.SunmiPrinterService;

import javax.annotation.Nonnull;

// import woyou.aidlservice.jiuiv5.ICallback;
// import woyou.aidlservice.jiuiv5.IWoyouService;

public class App1Module extends ReactContextBaseJavaModule {

    private ReactApplicationContext mReactApplicationContext;

//    private IWoyouService mWoyouService;

    public App1Module(@Nonnull ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    //    Log.d("调试-创建本地模块App1", reactApplicationContext.toString());
        this.mReactApplicationContext = reactApplicationContext;

        // createWoyouService();
    }

    // private void createWoyouService() {
    //     Intent intent = new Intent();
    //     intent.setPackage("");
    //     intent.setComponent(new ComponentName("woyou.aidlservice.jiuiv5", "woyou.aidlservice.jiuiv5.IWoyouService"));

    //     new ServiceConnection() {
    //         @Override
    //         public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
    //             Log.d("调试-连接上IWoyouService", componentName.toString());
    //             mWoyouService = IWoyouService.Stub.asInterface(iBinder);
    //         }

    //         @Override
    //         public void onServiceDisconnected(ComponentName componentName) {
    //             Log.d("调试-断开连接IWoyouService", componentName.toString());
    //             mWoyouService = null;
    //         }
    //     };
    // }


    @Nonnull
    @Override
    public String getName() {
        return "App1Module";
    }

    @ReactMethod
    public void callApp2(String transferData) {
       // Toast.makeText(MainActivity.getCurrentActivity(), "App1Module.callApp2:" + transferData, Toast.LENGTH_SHORT).show();
     //   Log.d("调试App1Module.callApp2", "接收到:" + transferData);
        mReactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("callApp2", transferData);
        // App2Module.getInstance(null).callApp2(transferData);
    }

    /**
     * 打开钱柜
     */
    @ReactMethod
    public void openDrawer() {
        SunmiPrinterService service = InnerPrinterUtils.getService();
        if (service == null) {
            Toast.makeText(MainActivity.getCurrentActivity(), "尚未连接内部打印机，无法打开钱柜", Toast.LENGTH_SHORT).show();
            return;
        }

        try {
            service.openDrawer(null);
        } catch (RemoteException e) {
            e.printStackTrace();
            Toast.makeText(MainActivity.getCurrentActivity(), "App1Module.openDrawer:服务调用失败", Toast.LENGTH_SHORT).show();
        }
    }

}
