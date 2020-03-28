import { computed } from 'mobx';
import OnlineDetailMo from './OnlineDetailMo';
import ProductDetailMo from './ProductDetailMo';

/**
 * 购物车详情
 */
export default class CartDetailMo {

    /**
     * 使用工具类自动生成的时间戳
     */
    id!: string;

    /**
     * 上线Id
     */
    onlineId?:string;

    /**
     * 上线规格Id
     */
    onlineSpecId?:string;

    /**
     * 产品ID
     */
    productId?:string;

    /**
     * 产品规格ID
     */
    productSpecId?:string;

    /**
     * 商品条码
     */
    barcode?: string;

    /** 
     * 上线详情
     * 如果为空，说明此商品没有上线
     */
    onlineDetail?: OnlineDetailMo;
    /** 
     * 产品详情
     * 如果为空，说明此商品没有添加到产品库中
     */
    productDetail?: ProductDetailMo;

    /** FlatList组件需要的属性 */
    key!: string;
    /** 商品名称 */
    goodsName!: string;

    /**是否称重商品 */
    isWeighGoods?: boolean;

    /** 商品销售价格(单价) */
    salePrice!: number;
    /** 返现金额 */
    cashbackAmount?: number;
    /** 返佣金额 */
    commissionAmount?: number;

    /** 购买数量 */
    buyCount!: number;
    /** 销售单位 */
    saleUnit?: string;
    /** 是否是临时商品 */
    isTempGood!: boolean;
    /** 小计 = 商品销售价格(单价) * 购买数量 */
    @computed
    get subTotal(): number {
        return this.salePrice * this.buyCount;
    };

}
