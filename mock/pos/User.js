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

exports.login = function(req, resp) {
    const { userName, loginPswd } = req.body;
    console.log('login', userName, loginPswd);

    // // 测试登录失败
    // const data = {
    //     result: -1,
    //     msg: '登录失败',
    // };

    const data = {
        result: 1,
        msg: '登录成功',
        user: {
            id: '1',
            nickname: 'mock测试用户',
            face: 'https://picsum.photos/200/200',
        },
        shop: {
            shortName: '华尔街工谷总店',
        },
    };

    resp.json(data);
};
