package com.smpos;

import android.app.Presentation;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.Display;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;

public class SecondaryActivity extends Presentation {

    private Context mOuterContext;
//    private Application mApplication;
//    private MainActivity mMainActivity;
    private ReactInstanceManager mReactInstanceManager;

    //    public SecondaryActivity(Context outerContext, Display display, Application application, MainActivity mainActivity) {
//        super(outerContext, display);
//        mOuterContext = outerContext;
//        mApplication = application;
//        mMainActivity = mainActivity;
//        Log.d("创建SecondaryActivity", outerContext.toString());
//    }
    public SecondaryActivity(Context outerContext, Display display, ReactInstanceManager reactInstanceManager) {
        super(outerContext, display);
        mOuterContext = outerContext;
//        mApplication = application;
//        mMainActivity = mainActivity;
        mReactInstanceManager = reactInstanceManager;
        Log.d("创建SecondaryActivity", outerContext.toString());
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
////        getWindow().setType(WindowManager.LayoutParams.TYPE_SYSTEM_ALERT);
//        setContentView(R.layout.second_screen);


        // 副屏载入react native的主页面
        ReactRootView mReactRootView = new ReactRootView(mOuterContext);

//        ReactInstanceManager mReactInstanceManager = ReactInstanceManager.builder()
//                .setApplication(mApplication)
//                .setCurrentActivity(mMainActivity)
//                .setBundleAssetName("index.android.bundle")
//                .setJSMainModulePath("index")
//                .addPackage(new MainReactPackage())
//                //                .addPackage(new RNGestureHandlerPackage())
//                .addPackage(new App2ReactPackage())
//                .setUseDeveloperSupport(BuildConfig.DEBUG)          // 开发时要使用调试模式
//                .setInitialLifecycleState(LifecycleState.RESUMED)
//                .build();


        // The string here (e.g. "MyReactNativeApp") has to match
        // the string in AppRegistry.registerComponent() in index.js
        // 第二个参数要与在用AppRegistry.registerComponent()注册的组件的名字一致
        // 本项目规范在项目根目录的index.js文件中注册组件，请在这个文件中检查组件注册的情况
        mReactRootView.startReactApplication(mReactInstanceManager, "App2", null);

        Log.d("mReactRootView", mReactRootView.getContext().toString());

        setContentView(mReactRootView);
    }
}
