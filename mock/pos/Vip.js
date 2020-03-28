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

exports.setVipInfo = function (req, resp) {

    const { mobile } = req.body;
    console.log(mobile)
    let data
    if (mobile == 123) {
        data = {
            result: 1,
            msg: '会员登录成功',
            user: {
                id: '1',
                nickname: 'vip用户',
                face: 'https://picsum.photos/200/200',
            },
            shop: {
                shortName: '华尔街工谷总店',
            },
        };
    } else {
        data = {
            result: -1,
            msg: '会员不存在',
        };
    }


    resp.json(data);
};

exports.setVipInfoById = function (req, resp) {

    const { id } = req.body;
    console.log('id:' + id)
    let data
    if (id == 1) {
        data = {
            result: 1,
            msg: '会员登录成功',
            user: {
                id: '1',
                nickname: 'vip用户',
                face: 'https://picsum.photos/200/200',
            },
            shop: {
                shortName: '华尔街工谷总店',
            },
        };
    } else {
        data = {
            result: -1,
            msg: '会员不存在',
        };
    }


    resp.json(data);
};
