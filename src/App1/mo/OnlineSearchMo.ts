import { observable, computed } from 'mobx';
import env from '../env';

/**
 * 搜索上线信息
 */
export default class OnlineSearchMo {

    /**
     * 上线规格ID
     */
    id?:string;

    /**
     * 上线ID
     */
    onlineId?: string;

    /**
     * 上线规格名称
     *
     */
    onlineSpec!:String ;

    /**
     * 销售价格(单价)
     *
     */
    salePrice?: number;
    /**
     * 成本价格
     *
     */
    costPrice?: number;

    /**
     * 返现金额
     *
     */
    cashbackAmount?: number;

    /**
     * 返佣金额
     *
     */
    commissionAmount?: number;
    /**
     * 购买积分
     *
     */
    buyPoint?: number;

    /**
     * 首单积分
     *
     */
    firstBuyPoint?: number;

    /**
     * 销售单位
     *
     */
    saleUnit?: string;

    /**
     * 限制购买数量(默认为0，不限制)
     * 每个人限制购买的数量
     *
     */
    limitCount?: number;
}
