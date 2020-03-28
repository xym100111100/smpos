import { action, flow } from "mobx";
import stores from '../stores';
import SaveOrderMo from "../mo/SaveOrderMo";
import Toast from "react-native-root-toast";
import { AsyncStorage } from "react-native";


/**
 * 存单相关action
 */
class SaveOrderAction {
    /**
     * 存单
     */
    @action
    addToSaveOrder = flow(async function* () {
        const { vip, cart, save } = stores;
        const saveOrderMo = new SaveOrderMo();
        saveOrderMo.vipMo = vip.vipMo;
        if (cart.cartDetailList.length === 0) {
            return Promise.reject('没有商品');
        }
        saveOrderMo.cartDetalMo = Array.from(cart.cartDetailList);
        save.saveOrderMoList.push(saveOrderMo);

        await AsyncStorage.setItem("saveList",JSON.stringify(save.saveOrderMoList));
            
        return Promise.resolve("存单成功");

    })

    /**
     * 删除存单列表的某个订单
     */
    @action
    deleteOne = async (index:number) =>{
        const { vip, cart, save } = stores;
        if(save.saveOrderMoList.length == 1){
            save.saveOrderMoList.clear();
            await AsyncStorage.removeItem('saveList');
        }else{
            save.saveOrderMoList.splice(index,1);
        }
        // Toast.show('取' + save.saveOrderMoList.length, { position: Toast.positions.TOP });
        await AsyncStorage.setItem("saveList",JSON.stringify(save.saveOrderMoList));
    }
}

export default SaveOrderAction;




