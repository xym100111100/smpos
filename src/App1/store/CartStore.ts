import { computed, observable, IObservableArray } from 'mobx';
import CartDetailMo from '../mo/CartDetailMo';
import { formatCurrency } from "../util/MoneyUtils";

/**
 * 购物车
 */
export default class CartStore {
    /** 购物车详情列表 */
    @observable
    cartDetailList: IObservableArray<CartDetailMo> = observable([]);

    /**
     * 购物车商品折扣后的总销售金额
     */
    totalDiscountAmount: number = 0;
    /**
     * 计算购物车商品的总销售金额
     */
    @computed
    get totalSaleAmount(): string {
        const initialValue = 0;
        return formatCurrency(this.cartDetailList.reduce((sum, cur, index, arr) => {
                const totalAmout = cur.salePrice * cur.buyCount;
                return sum + totalAmout;
            }, initialValue));
    }
    /**
     * 计算购物车商品的总购买数量
     */
    @computed
    get totalBuyCount(): number {
        const initialValue = 0;
        return this.cartDetailList.reduce((sum, cur, index, arr) => {
            return sum + cur.buyCount;
        }, initialValue);
    }
}
