import { post,get } from '../../util/RequestUtils';
import OnlineInPosMo from '../../mo/OnlineInPosMo';

/**
 * 会员相关请求
 * 注意参数 !!!
 * post put 是以这种格式{data:object}
 * get delete是以这个种格式{params: object}
 * 
 */
export default class PosOnlineReq {
    static getPrdInfoByCode(code: string) {
        return get('/prd-svr/prd/productspeccode/get-detail-by-code', { params: { code } });
    }

    static addOnlineInPos(mo: OnlineInPosMo) {
        return post('/prd-svr/prd/productspeccode/add-online-by-code', { data: mo });
    }
}

