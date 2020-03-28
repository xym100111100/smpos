/**
 * CustomIcon.ts
 * 建立自定义字体的图标库
 */
import { createIconSet } from 'react-native-vector-icons';
const glyphMap = {
    'checkout': 58930, // 收银台图标
};
const CustomIcon = createIconSet(glyphMap, 'Custom', 'Custom.ttf');

export default CustomIcon;
