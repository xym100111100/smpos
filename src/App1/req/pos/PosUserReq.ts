import { post } from '../../util/RequestUtils';
import UserLoginMo from '../../mo/UserLoginMo';

/**
 * 用户相关请求
 * 注意参数 !!!
 * post put 是以这种格式{data:object}
 * get delete是以这个种格式{params: object}
 * 
 */
export default class PosUserReq {
    static loginByUserName(login:UserLoginMo) {
        return post('/damai-svr/smpos/user/login', { data:login });
    }
}
