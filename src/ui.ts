/**
 * ui.ts
 * 本文件存放用户界面相关的变量
 * 提供输出ui变量
 */
import { Dimensions, Platform, StatusBar } from "react-native";

class UI {
    /** 屏幕的宽度 */
    screenWidth: number;
    /** 屏幕的高度 */
    screenHeight: number;

    constructor() {
        const { height, width } = Dimensions.get('window');
        this.screenWidth = width;
        this.screenHeight = height;
    }
};



const ui = new UI();

console.log('ui', ui);

export default ui;
