import { get } from '../../util/RequestUtils';
import OnlineSearchMo from '../../mo/OnlineSearchMo';
import Toast from 'react-native-root-toast';
/**
 * 搜索相关请求
 * 
 * 注意参数 !!!
 * post put 是以这种格式{data:object}
 * get delete是以这个种格式{params: object}
 * 
 */
export default class PosSearchReq {

    static onlineSearch(onlineSearchMo: OnlineSearchMo,shopId:String) {
        let onlineSpec= onlineSearchMo.onlineSpec;
        return get('/onl-svr/onl/online-spec/search', { params: {onlineSpec,shopId} });
    }
}
