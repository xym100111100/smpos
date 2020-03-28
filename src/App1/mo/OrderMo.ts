import env from "../env";
import OrderDetailMo from './OrderDetailMo'

/**
 * 订单信息
 */

export default class OrderMo {

    /**
     * 操作人id，目前使用来获取该操作人id的组织来作为临时
     * 商品的上线组织。
     */
    
    opId!: string;
    /**
     * 会员ID(suc中的用户ID)
     *
     */
    userId!: string;

    /**
     * 支付方式(1:现金 2:微信 3:支付宝 4:组合)
     */
    payWay!: number;

    /**
     * 购买总价
     */
    totalSaleAmount!: number;


    /**
     * 购买总数量
     */
    totalBuyCount!: number;
    /**
     * 第一种支付方式金额
     * 备注：如果是组合支付的话，那么购买总价就是两种支付方式相加，
     * 否则第二种支付方式就是0
     */
    firstAmount!: number;


    /**
     * 第二种支付方式金额
     * 备注：如果是组合支付的话，那么购买总价就是两种支付方式相加，
     * 否则第二种支付方式就是0
     */
    towAmount?: number;

    /**
     * 是否当场签收
     */
    isNowReceived?:boolean;

    /**
     * 是否是手工记账
     */
    isSgjz?:boolean;

    /**
     * 订单详情集合
     */
    details!: Array<OrderDetailMo>;

    /**
     * 折扣金额
     */
    discountMoney?: number
}