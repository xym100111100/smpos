import env from "../env";

/**
 * 订单详情信息
 */

export default class OrderDetailMo {
    /**
     * 可能是临时商品名字，或者是上线活动名字或者是产品名字或者是临时商品的名字
     */
    goodName!: string;

    /**
     * 上线规格ID
     *
     */
    onlineSpecId?: string;

    /**
    * 上线ID
    *
    */
    onlineId?: string;

    /**
     * 产品规格ID
     */
    productSpecId?: string;

    /**
     * 产品ID
     */
    productId?: string;
    /**
     * 购买数量
     */
    buyCount!: number;

    /**
     * 购买价格（单价）
     */
    buyPrice!: number;

    /**
     * 是否是临时商品
     */
    isTempGood!: boolean

}