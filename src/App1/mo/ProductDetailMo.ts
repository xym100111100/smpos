import ProductMo from "./ProductMo";
import { computed } from "mobx";

/**
 * 产品详情信息
 */
export default class ProductDetailMo {

    /** 商品条码 */
    barcode!: string;
    /** 产品详情ID */
    productSpecId!: string;
    /** 产品ID */
    productId!: string;
    /** 产品规格 */
    spec!: string;
    /** 产品信息 */
    product!: ProductMo;
    /** 产品详情全称 = 产品名称 + ‘ ’ + 产品规格 */
    @computed
    get fullName(): string { return this.product.name + ' ' + this.spec };
    /** 是否称重商品 */
    isWeighGoods?: boolean;
    /** 销售价格(单价) */
    salePrice!: number;
    /** 销售单位 */
    saleUnit?: string;
    /** 市场销售价格(单价) */
    marketPrice?: number;
}
