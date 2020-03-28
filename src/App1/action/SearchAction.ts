import { action, flow } from "mobx";
import OnlineSearchMo from "../mo/OnlineSearchMo";
import PosSearchReq from "../req/pos/PosSearchReq";
import Toast from "react-native-root-toast";


/**
 * 搜索相关action
 */
class SearchAction {
    /**
     * 根据商品名称搜索信息
     */
    @action
    searchByName = flow(function* (onlineSearchMo: OnlineSearchMo,shopId:String) {
        try {
            let data:Array<OnlineSearchMo> = yield PosSearchReq.onlineSearch(onlineSearchMo,shopId);
            // Toast.show(''+data[0],{ position: Toast.positions.TOP });
            if (data!==null && data.length !== 0) {
                // 返回成功
                return Promise.resolve(data);
            } else {
                return Promise.reject(data);
            }
        } finally {

        }

    })
}

export default SearchAction;
