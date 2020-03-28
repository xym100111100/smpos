import { observable } from 'mobx';

export default class LoadingStore {
    /** 是否正在加载所有数据 */
    @observable
    all: boolean = false;
    /** 是否正在扫条码 */
    @observable
    scanningBarcode: boolean = false;
}
