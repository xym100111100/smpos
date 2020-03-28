import * as React from "react";
import { View, Text,  StyleSheet, Modal, TouchableWithoutFeedback, FlatList, TouchableNativeFeedback } from 'react-native';
import { inject, observer } from "mobx-react";
import Toast from "react-native-root-toast";
import actions from "../../action";
import { SearchBar, Input,ListItem } from "react-native-elements";
import OnlineSearchMo from "../../mo/OnlineSearchMo";
import ShopStore from "../../store/ShopStore";


interface SearchModelProps {
    /**
     * 关闭窗口的事件
     */
    doClose: () => void;
    /**
     * 提交事件
     */
    doSubmit: (payload: object) => void;
    /**
     * 窗口标题
     */
    title: string;
    /**
     * 是否可见
     */
    visible: boolean;


}
interface InjectedProps extends SearchModelProps {
    /**店铺 */
   shop:ShopStore

}



interface SearchModelStates {
    searchText: string,
    searchList: Array<OnlineSearchMo>,
}

@inject(({ shop }) => ({
    shop
}))
export default class SearchModel extends React.Component<SearchModelProps, SearchModelStates> {
    constructor(props: SearchModelProps) {
        super(props);
        this.state = {
            searchText: '',
            searchList: [],
        }
    }
    get injected() {
        return this.props as InjectedProps;
    }
    componentDidMount() {
        //     const { orderList } = this.props;
        //     let defualtList = [];
        //     for (let i = 0; i < orderList.saveOrderMoList.length; i++) {
        //         let list = {
        //             orderList: new SaveOrderMo(),
        //             isActive: false
        //         };
        //         list.isActive = false;
        //         list.orderList = { ...orderList.saveOrderMoList[i] };
        //         defualtList.push(list);
        //     }
        //     this.setState({
        //         defualtList: defualtList
        //     });
    }
    componentWillUnmount() {

    }

    /**
     * 更新搜索框的文本
     */
    updateSearch = (searchText: string) => {
        const { searchAction } = actions;
        const { shop } = this.injected;
        this.setState({ searchText });
        if (searchText !== null && searchText !== '') {
            const onlineSearchMo = new OnlineSearchMo();
            onlineSearchMo.onlineSpec = searchText;
            //实时搜索
            searchAction.searchByName(onlineSearchMo,shop.id).then((msg: any) => {
                Toast.show('' + msg[0].onlineSpec, { position: Toast.positions.TOP });
                if (msg !== null && msg !== '' ) {
                    this.setState({ searchList: msg });
                } else {
                    this.setState({ searchList: [] });
                }
            }).catch((error: string) => {
                this.setState({ searchList: [] });
            })
        }
    };

    /**
     * 
     */
    renderHeader = () => {
        const { searchText } = this.state;
        return (
            <Input
                leftIcon={{ type: 'antdesign', name: 'search1', containerStyle: styles.searchbarIcon }}
                placeholder="搜索商品...."
                onChangeText={(text) => this.updateSearch(text)}
                autoFocus={true}
            />

        );
    };
    /**
     * 分隔
     */
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '86%',
                    backgroundColor: '#CED0CE',
                    marginLeft: '14%',
                }}
            />
        );
    };

    /**
     * 关闭窗体
     */
    closeModal = () => {

    }
    render() {
        // modal初始化时候的top值 
        const { visible, children, doSubmit, title, doClose, ...restProps } = this.props;


        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={() => doClose()}
            >
                <TouchableWithoutFeedback onPress={() => doClose()} >
                    <View style={styles.vipContainer} >
                        <TouchableWithoutFeedback onPress={() => null} >
                            <View style={styles.vipBox} >
                                <View style={styles.vipHeader}  >
                                    <Text style={styles.vipHeaderText}  >{title}</Text>
                                </View>
                                <View style={styles.direction}>
                                    <FlatList
                                        data={this.state.searchList}
                                        renderItem={({ item }) => (
                                            <TouchableNativeFeedback onPress={() => doSubmit(item)}>
                                                <ListItem
                                                    title={`${item.onlineSpec}     ${item.salePrice}元`}
                                                />
                                            </TouchableNativeFeedback>
                                        )}
                                        keyExtractor={item => item.id + ''}
                                        ItemSeparatorComponent={this.renderSeparator}
                                        ListHeaderComponent={this.renderHeader}
                                    />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}


const styles = StyleSheet.create({
    vipContainer: {
        backgroundColor: 'rgba(100,100,100,0.3)',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    vipBox: {
        backgroundColor: 'white',
        height: '80%',
        width: '80%',
        alignItems: 'center',
    },
    direction: {
        flexDirection: 'row'
    },
    vipHeader: {
        // backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        marginBottom: 20,
        marginTop: 20,
    },
    vipHeaderText: {
        fontSize: 20,
        // backgroundColor: 'blue',
    },
    title: {
        fontSize: 20
    },
    searchbarContainer: {
        width: 400,
        height: 30,
        marginHorizontal: 10,
    },
    searchbarInput: {
        padding: 0,
        margin: 0
    },
    searchbarIcon: {
        padding: 0,
        margin: 0
    },
});
