import { post,get } from '../../util/RequestUtils';

/**
 * 会员相关请求
 * 注意参数 !!!
 * post put 是以这种格式{data:object}
 * get delete是以这个种格式{params: object}
 * 
 */
export default class PosVipReq {
    static setVipInfo(mobile: string) {
        return get('/suc-svr/user/login-by-telephone', { params: { mobile } });
    }

    static setVipInfoById(id: string) {
        return post('/pos-svr/setVipInfoById', { data: { id } });
    }
}

