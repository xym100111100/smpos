const Mock = require('mockjs');

// mock只有一级搜索分类的数据
const templateOne = {
    'activityList|8-21': [
        {
            'id|15': /[0-9]/,
            title: '@ctitle(3,7)',
            picPath: /https:\/\/picsum\.photos\/200\/200\/\?image=\d{3}/,
            'goodsList|1-5': [
                {
                    'id|15': /[0-9]/,
                    spec: '@ctitle(1,3)',
                    'price|1-50.2': 1,
                },
            ],
        },
    ],
};
// mock只有两级搜索分类的数据
const templateTwo = {
    'categoryList|2-3': [
        {
            'id|15': /[0-9]/,
            name: '@ctitle(3,7)',
            'activityList|3-15': [
                {
                    'id|15': /[0-9]/,
                    onlineTitle: '@ctitle(3,6)',
                    picPath: /https:\/\/picsum\.photos\/200\/200\/\?image=\d{3}/,
                    'goodsList|1-5': [
                        {
                            'id|15': /[0-9]/,
                            onlineSpec: '@ctitle(1,3)',
                            'salePrice|1-50.2': 1,
                        },
                    ],
                },
            ],
        },
    ],
};

/**
 * 通过条码获取商品详情
 */
exports.getGoodsDetailByBarcode = function (req, resp) {
    const barcode = req.originalUrl
    var arr = barcode.split("=");


    // // 测试找不到上线详情和产品详情
    // const data = {
    //     result: 1,
    //     msg: '找不到上线详情和产品详情',
    // };

    // 测试找到1条上线详情
    const data = {
        result: 1,
        msg: '找到1条上线详情',
        onlineDetailList: [
            {
                'id|15': /[0-9]/,
                'key|15': /[0-9]/,
                goodsName: '@ctitle(3,7)',
                'salePrice|1-50.2': 1,
                cashbackAmount: 0,
                commissionAmount: 0,
                'isWeighing|1': true,
                'subTotal|1-50.2': 1,
                'buyCount|1': /[0-9]/,
                barcode: arr[1],
                saleUnit: '个',
            },
        ],
    };

    data.onlineDetailList[0] = Mock.mock(data.onlineDetailList[0])
    console.log(data)
    resp.json(data);
};
