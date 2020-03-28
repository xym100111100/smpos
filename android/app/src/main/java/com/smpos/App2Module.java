package com.smpos;

import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nonnull;

public class App2Module extends ReactContextBaseJavaModule {

    private static App2Module app2Module;

    public static App2Module getInstance(ReactApplicationContext reactApplicationContext) {
        if (app2Module == null)
            app2Module = new App2Module(reactApplicationContext);
        return app2Module;
    }

    private ReactApplicationContext mReactApplicationContext;

    public App2Module(@Nonnull ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        Log.d("调试App2Module", "创建本地模块App2:" + reactApplicationContext);
        this.mReactApplicationContext = reactApplicationContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "App2Module";
    }

    //    @ReactMethod
    public void callApp2(String transferData) {
//        Looper.prepare();
//        Toast.makeText(mReactApplicationContext, "调用callApp2:" + mReactApplicationContext.toString(), Toast.LENGTH_SHORT).show();
//        Looper.loop();// 进入loop中的循环，查看消息队列
        Log.d("调试App2Module.callApp2", transferData);
        mReactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("callApp2", transferData);
    }


}
