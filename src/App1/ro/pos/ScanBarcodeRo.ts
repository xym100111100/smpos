import OnlineDetailMo from "../../mo/OnlineDetailMo";
import ProductDetailMo from "../../mo/ProductDetailMo";
import Ro from "./Ro";

/**
 * 扫描条码的结果
 */
export default interface ScanBarcodeRo extends Ro {
    /**
     * 条码
     */
    barcode: string,
    /**
     * 找到的数量
     */
    result: number,
    /**
     * 找到的结果
     */
    msg: string,
    /** 上线详情列表 */
    onlineDetailList: OnlineDetailMo[];
    /** 产品详情列表 */
    productDetailList: ProductDetailMo[];
}
