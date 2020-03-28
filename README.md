# SMPOS 商超收银系统

[TOC]

## 1. 安装

```sh
yarn
```

## 2. 开发

### 2.1. 单独启动AVD(MAC)

1. `cd ~/Library/Android/sdk/tools/`
2. `./emulator -list-avds` 
  列出av列表，比如会显示 `Sunmi_D1s_Main_Display_API_25`
3. `./emulator @Sunmi_D1s_Main_Display_API_25`
4. `ctrl + z` 切到后台挂起
5. `bg` 在后台继续执行

### 2.2. 修改环境变量

项目 `src` 目录下，打开 `env.js` 文件，修改 `env.BASE_URL=....` 的地址为当前开发机器的地址

### 2.3. 运行mock服务器

```sh
yarn mock
```

### 2.4. 调试

#### 2.4.1. 直接调试

```sh
yarn start
```

#### 2.4.2. 在VsCode中集成调试

1. 安装 `React Native Tools` 插件
2. 在左侧栏的 `Debug` 视图中，'Add Config(reactnative)'
3. 在项目根目录的 `.vscode` 目录下添加 `settings.json` 文件，并填写内容如下：

```text
{
    "react-native.packager.port": 13080,
    "react-native.android.runArguments.device": ["--device", "DB04193L40575"]
}
```

第一个是自定义 `React Native` 调试的本机端口；第二个是指定调试移动端的设备ID，可用命令 `adb devices` 查询

4. 重启 `VsCode`
5. 在左侧栏的 `Debug` 视图中，启动 `Debug Android`

### 2.5. 在移动端调出开发者菜单

- 摇一摇
- 电脑端命令行输入 `adb shell input keyevent 82`

### 2.6. 开发注意事项

- 改变store中状态，必须在action的方法中
- 在页面中引入store中的状态，一定要在@inject中具体描述出来

## 3. 将应用直接部署到移动端

```sh
yarn android
```
