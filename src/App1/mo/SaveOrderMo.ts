import CartDetailMo from './CartDetailMo';
import VipMo from './VipMo';
import { IObservableArray } from 'mobx';


export default class SaveOrderMo {
    /**
     * 购物车详情
     */
    cartDetalMo !: Array<CartDetailMo>;

    /**
     * 会员信息
     */
    vipMo !: VipMo;
}
