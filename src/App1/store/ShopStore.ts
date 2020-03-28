import { observable } from 'mobx';

export default class ShopStore {
    /**
     * 店铺ID
     */
    @observable
    id!: String;
    /**
     * 店铺名称
     */
    @observable
    name!: String;
    /**
     * 店铺简称
     */
    @observable
    shortName!: String;
}
