import { flow } from 'mobx';
import PosUserReq from '../req/pos/PosUserReq';
import stores from '../stores';
import { login } from '../../../mock/pos/User';
import UserLoginMo from '../mo/UserLoginMo';

/**
 * 用户相关action
 */
class UserAction {
    /**
     * 通过用户名称(手机、邮箱、登录名称)登录
     * @param params 通过用户名称(手机、邮箱、登录名称)登录的参数
     */
    loginByUserName = flow(function* (login: UserLoginMo) {
        const { loading, user, shop } = stores;
        if (loading.all) return; // 判断加载状态如果正在加载中，直接返回（防止多次点击）
        // 先设置正在加载的状态
        loading.all = true;
        try {
            // 发出请求，等待返回数据
            let data = yield PosUserReq.loginByUserName(login);

            if (data && data.result === 1) {
                // 校验数据
                if (!data.user)
                    return Promise.reject('没有用户数据');
                if (!data.shop)
                    return Promise.reject('没有店铺数据');
                if (!data.shop.shortName)
                    return Promise.reject('店铺没有简称');
                if (!data.shop.id)
                    return Promise.reject('店铺没有id');

                // 更新状态
                user.id = data.user.id;                                 // 更新当前用户ID
                user.nickname = data.user.nickname;                     // 更新当前用户昵称
                user.face = data.user.face;                             // 更新当前用户头像
                shop.shortName = data.shop.shortName;                   // 更新店铺名称
                shop.id = data.shop.id;                                 // 更新当前店铺ID
                // 返回成功
                return Promise.resolve(data.msg);
            } else {
                return Promise.reject(data.msg);
            }
        } finally {
            // 设置完成加载的状态
            loading.all = false;
        }
    });
}

export default UserAction;
