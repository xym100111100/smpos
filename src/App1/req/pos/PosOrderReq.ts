import { post, get } from '../../util/RequestUtils';
import OrderMo from '../../mo/OrderMo';
/**
 * 订单相关请求
 * 
 * 注意参数 !!!
 * post put 是以这种格式{data:object}
 * get delete是以这个种格式{params: object}
 * 
 */
export default class PosOrderReq {

    static confirmOrder(payOrderId: String) {

        return get('/ord-svr/ord/order/confirmOrder', { params: { payOrderId: payOrderId } });
    }

    static order(orderMo: OrderMo) {

        return post('/ord-svr/ord/order', { data: orderMo });
    }

    static listOrder(mo: {}) {

        return get('/ord-svr/ord/order/listOrderForPos', { params: mo });
    }
    static getOrderDetailByOrderId(orderId: String) {

        return get('/ord-svr/ord/detailList', { params: { orderId } });
    }

    
    static posAgreetoarefund(orderId: String) {
        const OrdOrderReturnTo = {
            orderId:orderId
        }
        return post('/ord-svr/ord/return/posAgreetoarefund', { data: OrdOrderReturnTo });
    }

    static posPayOrder(mo: {}) {

        return post('/ord-svr/ord/order/posPayOrder', { data: mo });
    }

    /**
     * 重新下单
     * @param mo 
     */
    static orderAgain(mo: {}) {

        return post('/ord-svr/ord/order/orderAgain', { data: mo });
    }
}
