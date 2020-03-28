package com.smpos;

import android.content.Context;
import android.content.Intent;
import android.media.MediaRouter;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.view.Display;
import android.view.KeyEvent;
import android.view.WindowManager;
import android.widget.Toast;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

    private final int OVERLAY_PERMISSION_REQ_CODE = 1; // Choose any value

    private static MainActivity mCurrentActivity;

    public static MainActivity getCurrentActivity() {
        return mCurrentActivity;
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "App1";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mCurrentActivity = this;

        // 隐藏系统上方状态栏
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);

    }


    @Override
    protected void onResume() {
        super.onResume();

        // 显示副屏
        MediaRouter mediaRouter = (MediaRouter) getSystemService(Context.MEDIA_ROUTER_SERVICE);
        MediaRouter.RouteInfo localRouteInfo = mediaRouter.getSelectedRoute(MediaRouter.ROUTE_TYPE_LIVE_AUDIO);
        Display display = localRouteInfo != null ? localRouteInfo.getPresentationDisplay() : null;
        if (display != null) {
            Toast.makeText(MainActivity.getCurrentActivity(), "双屏显示", Toast.LENGTH_SHORT).show();
            // SYSTEM_ALERT_WINDOW权限申请
            if (!Settings.canDrawOverlays(MainActivity.getCurrentActivity())) {
                Toast.makeText(MainActivity.getCurrentActivity(), "请授权" + R.string.app_name + "使用副屏", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
                // 限制申请权限时只显示当前的应用(否则会列出所有应用)
                intent.setData(Uri.parse("package:" + getPackageName()));
                // 要再Service是中或者ApplicationContext中startActivity时要添加额外标志
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
                System.exit(0);
            } else {
                showSecondaryDisplay(display);
            }
        } else {
            Toast.makeText(MainActivity.getCurrentActivity(), "单屏显示", Toast.LENGTH_SHORT).show();
        }

        // 绑定内部打印机
        InnerPrinterUtils.bind();
    }

    /**
     * 显示副屏
     */
    private void showSecondaryDisplay(Display display) {
//        SecondaryActivity secondaryActivity = new SecondaryActivity(getApplicationContext(), display, getApplication(), this);
        SecondaryActivity secondaryActivity = new SecondaryActivity(getApplicationContext(), display, this.getReactInstanceManager());
        secondaryActivity.getWindow().setType(WindowManager.LayoutParams.TYPE_SYSTEM_ALERT);  // TYPE_SYSTEM_ALERT / TYPE_PHONE
//        secondaryActivity.getWindow().setType(WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY); // TYPE_SYSTEM_ALERT
        // / TYPE_PHONE
        secondaryActivity.show();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {

        // A. Prevent multiple events on long button press
        // In the default behavior multiple events are fired if a button
        // is pressed for a while. You can prevent this behavior if you
        // forward only the first event:
        // if (event.getRepeatCount() == 0) {
        // KeyEventModule.getInstance().onKeyDownEvent(keyCode, event);
        // }
        //
        // B. If multiple Events shall be fired when the button is pressed
        // for a while use this code:
        // KeyEventModule.getInstance().onKeyDownEvent(keyCode, event);
        //
        // Using B.
        KeyEventModule.getInstance().onKeyDownEvent(keyCode, event);

        // There are 2 ways this can be done:
        // 1. Override the default keyboard event behavior
        // super.onKeyDown(keyCode, event);
        // return true;

        // 2. Keep default keyboard event behavior
        // return super.onKeyDown(keyCode, event);

        // Using method #1 without blocking multiple
        // super.onKeyDown(keyCode, event);
        // return true;

        // Using method #2
        return super.onKeyDown(keyCode, event);
    }

    @Override // <--- Add this method if you want to react to keyUp
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        KeyEventModule.getInstance().onKeyUpEvent(keyCode, event);

        // There are 2 ways this can be done:
        // 1. Override the default keyboard event behavior
        // super.onKeyUp(keyCode, event);
        // return true;

        // 2. Keep default keyboard event behavior
        // return super.onKeyUp(keyCode, event);

        // Using method #2
        super.onKeyUp(keyCode, event);
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public boolean onKeyMultiple(int keyCode, int repeatCount, KeyEvent event) {
        KeyEventModule.getInstance().onKeyMultipleEvent(keyCode, repeatCount, event);
        return super.onKeyMultiple(keyCode, repeatCount, event);
    }
}
