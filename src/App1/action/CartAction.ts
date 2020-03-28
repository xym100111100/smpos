import { action, flow } from 'mobx';
import PosGoodsReq from '../req/pos/PosGoodsReq';
import stores from '../stores';
import Ro from '../ro/pos/Ro';
import CartDetailMo from '../mo/CartDetailMo';
import { IObservableArray } from 'mobx';
import { newId } from '../util/IdUtils';
/**
 * 购物车相关action
 */
class CartAction {

    /**
     * 将商品加入购物车
     * @param barcode 条码
     */
    @action
    addToCart = (cartDetail: CartDetailMo) => {
        const { cart } = stores;
        //　判断返回的购物车详情上线信息是否存在且是否已经存在购物车里面
        if (cartDetail.onlineDetail) {
            let oldData = cart.cartDetailList.find((item) =>  item.onlineSpecId === cartDetail.onlineSpecId)
            if (oldData) {
                // 证明该上线详情已经存在
                oldData.buyCount = oldData.buyCount + 1
                this.refresh();
                return;
            }

        }

        //　判断返回的购物车详情产品信息是否存在且是否已经存在购物车里面
        if (cartDetail.productDetail) {
            let oldData = cart.cartDetailList.find((item) => item.productSpecId === cartDetail.productSpecId)
            if (oldData) {
                // 证明产品详情已经存在
                oldData.buyCount = oldData.buyCount + 1
                this.refresh();
                return;
            }

        }

        // 这里是测试要删除的
        // if(cart.cartDetailList.length > 1){
        //     cart.cartDetailList[0].buyCount = cart.cartDetailList[0].buyCount+1
        //     this.refresh();
        //     return;
        // }

        // 生成时间戳id
        cartDetail.id = newId();
        cart.cartDetailList.unshift(cartDetail);
    }

    /**
     * 刷新状态触发页面重新渲染
     */
    @action
    refresh = () => {
        const { cart } = stores;
        let temp = cart.cartDetailList[0];
        cart.cartDetailList.splice(0, 1, temp)
    }

    /**
     * 删除购物车记录
     */
    @action
    delete = (id: string) => {
        const { cart } = stores;
        cart.cartDetailList.forEach(function (item, index) {
            if (item.id === id) {
                cart.cartDetailList.splice(index, 1)
            }
        })
    }

    /**
     * 清空购物车
     */
    @action
    clearCart = () => {
        try {
            const { cart } = stores;
            cart.totalDiscountAmount = 0;
            cart.cartDetailList.clear();
            // 返回成功
            return Promise.resolve("清除购物车成功");

        } finally {

        }
    }
    /**
     * 将商品加入购物车(通过扫条码)
     * @param barcode 条码
     */
    addToCartByBarcode = flow(function* (barcode: string,shopId:string) {
        const { loading } = stores;
        if (loading.scanningBarcode) return; // 判断加载状态如果正在加载中，直接返回（防止多次点击）
        // 先设置正在加载的状态
        loading.scanningBarcode = true;
        try {
            // 发出请求，等待返回数据
            const ro = (yield PosGoodsReq.getGoodsDetailByBarcode(barcode,shopId)) as Ro;
            if (ro && ro.result === 1) {
                // 返回成功
                return Promise.resolve(ro);
            } else {
                // 返回失败
                return Promise.reject(ro.msg);
            }
        } finally {
            // 设置完成加载的状态
            loading.scanningBarcode = false;
        }
    });


}

export default CartAction;
