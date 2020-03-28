import { flow } from 'mobx';
import stores from '../stores';
import Toast from 'react-native-root-toast';
import PosOnlineReq from '../req/pos/PosOnlineReq';
import OnlineInPosMo from '../mo/OnlineInPosMo';


/**
 * 会员相关action
 */
class OnlineAction {
    /**
     * 通过code查询产品
     */
    getPrdInfoByCode = flow(function* (code: string) {
        const { loading } = stores;
        if (loading.all) return; // 判断加载状态如果正在加载中，直接返回（防止多次点击）
        // 先设置正在加载的状态
        loading.all = true;
        try {
            // 发出请求，等待返回数据
            let data = yield PosOnlineReq.getPrdInfoByCode(code);

            if (data && data.result === 1) {
                // 返回成功
                return Promise.resolve(data);
            } else {
                return Promise.reject("没有找到产品");
            }
        } finally {
            // 设置完成加载的状态
            loading.all = false;
        }
    })
    /**
     * pos上线商品
     */
    addOnlineInPos = flow(function* (mo:OnlineInPosMo){
        try {
            // 发出请求，等待返回数据
            let data = yield PosOnlineReq.addOnlineInPos(mo);

            if (data && data.result === 1) {
                // 返回成功
                return Promise.resolve("上线成功");
            } else {
                return Promise.reject("上线失败");
            }
        } finally {

        }

    })
}

export default OnlineAction;
