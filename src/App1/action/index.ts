import UserAction from './UserAction';
import CartAction from './CartAction';
import VipAction from './VipAction';
import SaveOrderAction from './SaveOrderAction';
import OrderAction from './OrderAction';
import SearchAction from './SearchAction';
import OnlineAction from './OnlineAction';
class Action {
    userAction: UserAction = new UserAction();
    cartAction: CartAction = new CartAction();
    vipAction: VipAction = new VipAction();
    saveOrderAction: SaveOrderAction = new SaveOrderAction();
    orderAction: OrderAction = new OrderAction();
    searchAction: SearchAction = new SearchAction();
    onlineAction: OnlineAction = new OnlineAction();
}

const actions = new Action();

export default actions;
