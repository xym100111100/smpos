import { action, flow } from "mobx";
import OrderMo from "../mo/OrderMo";
import PosOrderReq from '../req/pos/PosOrderReq';
import { payOrder } from "../../../mock/pos/Order";


/**
 * 订单相关action
 */
class OrderAction {
    /**
     * 下订单
     */
    @action
    order = flow(function* (orderMo: OrderMo) {
        try {
            let data = yield PosOrderReq.order(orderMo);

            if (data && data.result === 1) {
                // 返回成功
                return Promise.resolve(data);
            } else {
                return Promise.reject(data.msg);
            }
        } finally {

        }

    })

    /**
     * 确定订单
     */
    @action
    confirmOrder = flow(function* (payOrderId: String) {
        try {
            let data = yield PosOrderReq.confirmOrder(payOrderId);

            if (data && data.result === 1) {
                // 返回成功
                return Promise.resolve(data.msg);
            } else {
                return Promise.reject(data.msg);
            }
        } finally {

        }

    })

    /**
     * 查询订单
     */
    @action
    listOrder = flow(function* (orderMo: {}) {
        try {
            let data = yield PosOrderReq.listOrder(orderMo);

            if (data) {
                // 返回成功
                return Promise.resolve(data);
            } else {
                return Promise.reject(data.msg);
            }
        } finally {

        }

    })

    /**
     * 查询订单
     */
    @action
    getOrderDetailByOrderId = flow(function* (orderId: String) {
        try {
            let data = yield PosOrderReq.getOrderDetailByOrderId(orderId);

            if (data) {
                // 返回成功
                return Promise.resolve(data);
            } else {
                return Promise.reject(data.msg);
            }
        } finally {

        }

    })
    /**
     * 同意退货
     */
    @action
    posAgreetoarefund = flow(function* (orderId: String) {
        try {
            let data = yield PosOrderReq.posAgreetoarefund(orderId);

            if (data) {
                // 返回成功
                return Promise.resolve(data);
            } else {
                return Promise.reject(data.msg);
            }
        } finally {

        }

    })

    /**
     * 支付订单，用来现金结账
     * 
     */
    @action
    posPayOrder = flow(function* (mo: {}) {
        try {
            let data = yield PosOrderReq.posPayOrder(mo);

            if (data) {
                // 返回成功
                return Promise.resolve(data);
            } else {
                return Promise.reject(data.msg);
            }
        } finally {

        }

    })

     /**
     * 再次支付订单，是用户在微信或者支付宝没有转而使用微信或者支付宝。
     * 
     */
    @action
    orderAgain = flow(function* (mo: {}) {
        try {
            let data = yield PosOrderReq.orderAgain(mo);

            if (data) {
                // 返回成功
                return Promise.resolve(data);
            } else {
                return Promise.reject(data.msg);
            }
        } finally {

        }

    })


}

export default OrderAction;
