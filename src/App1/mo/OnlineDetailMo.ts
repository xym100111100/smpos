import OnlineMo from "./OnlineMo";
import { computed } from "mobx";

/**
 * 上线详情信息
 */
export default class OnlineDetailMo {

    /**
     * 商品条码
     */
    barcode!: string;
    /**
     * 商品名称
     */
    spec!:string;
    /** 
     * 上线详情ID
     */
    onlineSpecId!: string;
    /**
     * 上线ID
     */
    onlineId!: string;
    /** 上线详情名称(旧称上线规格名称) */
    name!: string;
    /**
     * 上线信息
     */
    online!: OnlineMo;
    /** 上线详情的命名 = 上线标题 + 上线详情名称 */
    @computed
    get fullName(): string {
        return this.online.title + ' ' + this.name;
    }
    /** 是否称重商品 */
    isWeighGoods?: boolean;
    /** 销售单位 */
    saleUnit?: string;
    /** 销售价格(单价) */
    salePrice!: number;
    /** 返现金额 */
    cashbackAmount!: number;
    /** 返佣金额 */
    commissionAmount!: number;
}
