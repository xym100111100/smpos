import OnlineMo from "./OnlineMo";
import { computed } from "mobx";

/**
 * 从Pos上线信息
 */
export default class OnlineInPosMo {

    /**
     * 商品条码
     */
    barcode!: string;
    /** 上线详情名称(旧称上线规格名称) */
    name!: string;
    /** 是否称重商品 */
    isWeighGoods?: boolean;
    /** 销售单位 */
    saleUnit?: string;
    /** 销售价格(单价) */
    salePrice!: string;
    /** 分类名称 */
    categoryName!: string;
    /** 分类id */
    categoryId!: string;
    /** 库存 */
    saleCount!: string;
    /** 操作人 */
    opId!: string;
    /** 店铺id */
    shopId!: string;
}
