package com.smpos;

import android.app.Application;
import android.app.Presentation;
import android.content.Context;
import android.os.Bundle;
import android.view.Display;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.shell.MainReactPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

import java.util.Arrays;

public class SecondaryPresentation extends Presentation {

    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;

    private Context mOuterContext;
    private Application mApplication;

    public SecondaryPresentation(Context outerContext, Display display, Application application) {
        super(outerContext, display);
        mOuterContext = outerContext;
        mApplication = application;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 副屏载入react native的主页面
        mReactRootView = new ReactRootView(mOuterContext);
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(mApplication)
                .setCurrentActivity(this.getOwnerActivity())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index")
                // .addPackage(new MainReactPackage())
                .addPackages(Arrays.<ReactPackage>asList(
                        new MainReactPackage(),
                        new App1ReactPackage(),
                        new RNGestureHandlerPackage()))
                .setUseDeveloperSupport(BuildConfig.DEBUG)          // 开发时要使用调试模式
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();
        // The string here (e.g. "MyReactNativeApp") has to match
        // the string in AppRegistry.registerComponent() in index.js
        // 第二个参数要与在用AppRegistry.registerComponent()注册的组件的名字一致
        // 本项目规范在项目根目录的index.js文件中注册组件，请在这个文件中检查组件注册的情况
        mReactRootView.startReactApplication(mReactInstanceManager, "App2", null);

        setContentView(mReactRootView);
    }
}
