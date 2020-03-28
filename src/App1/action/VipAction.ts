import { flow } from 'mobx';
import PosVipReq from '../req/pos/PosVipReq';
import stores from '../stores';
import Toast from 'react-native-root-toast';
import VipMo from "../mo/VipMo";


/**
 * 会员相关action
 */
class VipAction {
    /**
     * 通过会员手机号登录
     * @param params 
     */
    setVipInfo = flow(function* (mobile: string) {
        const { loading, vip } = stores;
        if (loading.all) return; // 判断加载状态如果正在加载中，直接返回（防止多次点击）
        // 先设置正在加载的状态
        loading.all = true;
        try {
            // 发出请求，等待返回数据
            let data = yield PosVipReq.setVipInfo(mobile);

            if (data && data.result === 1) {
                // 更新状态
                const vipMo = new VipMo();
                vipMo.id = data.userId;                                 // 更新当前会员ID
                vipMo.nickname = data.nickname;                     // 更新当前会员昵称
                vipMo.face = data.face;                             // 更新当前会员头像

                vip.vipMo = vipMo;
                // 返回成功
                return Promise.resolve(data.msg);
            } else {
                return Promise.reject(data.msg);
            }
        } finally {
            // 设置完成加载的状态
            loading.all = false;
        }
    })

    /**
     * 通过会员id登录
     */
    setVipInfoById = flow(function* (id: string) {
        const { loading, vip } = stores;
        if (loading.all) return; // 判断加载状态如果正在加载中，直接返回（防止多次点击）
        // 先设置正在加载的状态
        loading.all = true;
        try {
            // 发出请求，等待返回数据
            let data = yield PosVipReq.setVipInfoById(id);

            if (data && data.result === 1) {
                // 更新状态
                const vipMo = new VipMo();
                vipMo.id = data.user.id;                                 // 更新当前会员ID
                vipMo.nickname = data.user.nickname;                     // 更新当前会员昵称
                vipMo.face = data.user.face;                             // 更新当前会员头像

                vip.vipMo = vipMo;
                // 返回成功
                return Promise.resolve(data.msg);
            } else {
                return Promise.reject(data.msg);
            }
        } finally {
            // 设置完成加载的状态
            loading.all = false;
        }
    })

    /**
     * 更新会员信息
     * @param params 
     */
    updateVipInfo = flow(function* () {
        const { loading, vip } = stores;
        if (loading.all) return; // 判断加载状态如果正在加载中，直接返回（防止多次点击）
        // 先设置正在加载的状态
        loading.all = true;
        try {

            const vipMo = new VipMo();
            // 更新状态
            vipMo.id = undefined;                                 // 更新当前会员ID
            vipMo.nickname = undefined;                           // 更新当前会员昵称
            vipMo.face = undefined;                                // 更新当前会员头像

            vip.vipMo = vipMo;
            // 返回成功
            return Promise.resolve("已经删除");

        } finally {
            // 设置完成加载的状态
            loading.all = false;
        }
    })

}

export default VipAction;
