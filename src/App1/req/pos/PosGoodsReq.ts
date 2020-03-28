import { post, get } from '../../util/RequestUtils';

/**
 * 购物车相关请求
 *  注意参数 !!!
 * post put 是以这种格式{data:object}
 * get delete是以这个种格式{params: object}
 * 
 */
export default class PosCartReq {
    /**
     * 通过条码获取商品详情
     * @param params 
     */
    static getGoodsDetailByBarcode(barcode1: string,shopId :string) {
        
        let barcode={};
        barcode.barcode = barcode1;
        barcode.shopId = shopId

        return get('/prd-svr/prd/productspeccode/barcode', { params: barcode });
    }
}
