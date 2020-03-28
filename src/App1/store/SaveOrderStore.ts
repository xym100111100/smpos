import { IObservableArray, observable } from "mobx";
import SaveOrderMo from "../mo/SaveOrderMo";


/**
 * 存单
 */
export default class SaveOrderStore {
    /** 存单列表 */
    @observable
    saveOrderMoList: IObservableArray<SaveOrderMo> = observable([]);
}