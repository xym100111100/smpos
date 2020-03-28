/**
 * stores.ts
 * 本文件是存放本应用的所有状态的仓库
 * 提供输出stores变量
 */
import { configure } from 'mobx';
import LoadingStore from './store/LoadingStore';
import ShopStore from './store/ShopStore';
import UserStore from './store/UserStore';
import ViewStore from './store/ViewStore';
import CartStore from './store/CartStore';
import VipStore from './store/VipStore';
import SaveOrderStore from './store/SaveOrderStore';

// 初始化mobx配置: 要想改变store里的状态，必须在action的函数中去做
configure({ enforceActions: 'observed' });

class Stores {
    /** 是否正在加载 */
    loading: LoadingStore = new LoadingStore();
    /** 用户 */
    user: UserStore = new UserStore();
    /** 店铺 */
    shop: ShopStore = new ShopStore();
    /** 购物车 */
    cart: CartStore = new CartStore();
    /** 视图 */
    view: ViewStore = new ViewStore();
    /** 会员 */
    vip: VipStore = new VipStore();
    /** 存单 */
    save:SaveOrderStore =new SaveOrderStore();
}

const stores = new Stores();

export default stores;
