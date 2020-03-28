package com.smpos;

import android.os.RemoteException;
import android.util.Log;
import android.widget.Toast;

import com.sunmi.peripheral.printer.InnerPrinterCallback;
import com.sunmi.peripheral.printer.InnerPrinterException;
import com.sunmi.peripheral.printer.InnerPrinterManager;
import com.sunmi.peripheral.printer.SunmiPrinterService;

public class InnerPrinterUtils {
    private static SunmiPrinterService mService;

    /**
     * 获取内部打印机的服务(如果尚未连接到内部打印机，返回null)
     */
    public static SunmiPrinterService getService() {
        if (mService == null) {
            Log.e("调试InnerPrinterUtils.getService", "尚未连接到内部打印机，service为null");
            return null;
        } else {
            return mService;
        }
    }

    // 连接内部打印机的回调
    private static InnerPrinterCallback mInnerPrinterCallback = new InnerPrinterCallback() {
        @Override
        protected void onConnected(SunmiPrinterService service) {
            // 这里即获取到绑定服务成功连接后的远程服务接⼝口句句柄，可以通过 service访问⽀支持的打印⽅方法
            mService = service;
            Toast.makeText(MainActivity.getCurrentActivity(), "连接内部打印机成功", Toast.LENGTH_SHORT).show();
        }

        //当服务异常断开后，会回调此⽅方法
        @Override
        protected void onDisconnected() {
            mService = null;
            Toast.makeText(MainActivity.getCurrentActivity(), "内部打印机连接被断开", Toast.LENGTH_SHORT).show();
        }
    };


    /**
     * 绑定服务
     */
    public static void bind() {
        try {
            // 绑定内部打印机
            InnerPrinterManager.getInstance().bindService(MainActivity.getCurrentActivity(), mInnerPrinterCallback);
        } catch (InnerPrinterException e) {
            //当服务异常断开后，会回调此⽅方法
            Toast.makeText(MainActivity.getCurrentActivity(), "绑定内部打印机出现异常", Toast.LENGTH_SHORT).show();
        }

    }
}
