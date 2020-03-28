package com.smpos;

import android.util.Log;
import android.view.KeyEvent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nonnull;

/**
 * KeyEventModule继承ReactContextBaseJavaModule用于实现原生模块方法
 */
public class KeyEventModule extends ReactContextBaseJavaModule {
    /**
     * react的上下文对象
     */
    private ReactApplicationContext mReactApplicationContext;

    /**
     * 通过DeviceEventEmitter.emit方法可向RN发送消息
     */
    private DeviceEventManagerModule.RCTDeviceEventEmitter mDeviceEventEmitter = null;

    /**
     * 该类的实例化对象(单例)
     */
    private static KeyEventModule INSTANCE = null;

    /**
     * 初始化静态实例并将其返回的静态方法
     */
    public static KeyEventModule init(ReactApplicationContext reactApplicationContext) {
        Log.d("调试-初始化静态实例并将其返回", reactApplicationContext.toString());
        if (INSTANCE == null)
            INSTANCE = new KeyEventModule(reactApplicationContext);
        return INSTANCE;
    }

    /**
     * 获取单例的静态方法
     */
    public static KeyEventModule getInstance() {
        return INSTANCE;
    }


    /**
     * 构造方法，初始化mReactApplicationContext对象
     * 注意是私有方法，禁止外部构建，在这里就只能从init方法中构建
     */
    private KeyEventModule(@Nonnull ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        Log.d("调试-创建本地模块KeyEvent", reactApplicationContext.toString());
        mReactApplicationContext = reactApplicationContext;
//        this.mDeviceEventEmitter = reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
    }

    /**
     * 返回模块名
     */
    @Nonnull
    @Override
    public String getName() {
        return "KeyEventModule";
    }

    public void onKeyDownEvent(int keyCode, KeyEvent keyEvent) {
        if (mDeviceEventEmitter == null) {
            //通过反射实例化DeviceEventEmitter
            mDeviceEventEmitter = mReactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
        mDeviceEventEmitter.emit("onKeyDown", getJsEventParams(keyCode, keyEvent, null));
    }

    public void onKeyUpEvent(int keyCode, KeyEvent keyEvent) {
        if (mDeviceEventEmitter == null) {
            //通过反射实例化DeviceEventEmitter
            mDeviceEventEmitter = mReactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
        mDeviceEventEmitter.emit("onKeyUp", getJsEventParams(keyCode, keyEvent, null));
    }

    public void onKeyMultipleEvent(int keyCode, int repeatCount, KeyEvent keyEvent) {
        if (mDeviceEventEmitter == null) {
            //通过反射实例化DeviceEventEmitter
            mDeviceEventEmitter = mReactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        }
        mDeviceEventEmitter.emit("onKeyMultiple", getJsEventParams(keyCode, keyEvent, repeatCount));
    }

    private WritableMap getJsEventParams(int keyCode, KeyEvent keyEvent, Integer repeatCount) {
        WritableMap params = new WritableNativeMap();
        int action = keyEvent.getAction();
        char text = (char) keyEvent.getUnicodeChar();

        params.putInt("code", keyCode);
        params.putInt("action", action);
        params.putString("text", String.valueOf(text));

        if (keyEvent.getAction() == KeyEvent.ACTION_MULTIPLE && keyCode == KeyEvent.KEYCODE_UNKNOWN) {
            String chars = keyEvent.getCharacters();
            if (chars != null) {
                params.putString("characters", chars);
            }
        }

        if (repeatCount != null) {
            params.putInt("repeatCount", repeatCount);
        }


        return params;
    }

}
