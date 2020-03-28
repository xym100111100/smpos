import { observable, computed, IObservableArray } from "mobx";
import env from "../env";
import VipMo from "../mo/VipMo";

export default class VipStore {
    @observable
    vipMo !: VipMo
}
