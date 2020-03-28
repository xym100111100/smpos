// const proxy = require('express-http-proxy');
const proxy = require('http-proxy-middleware');

const User = require('./pos/User');
const Goods = require('./pos/Goods');
const Vip = require('./pos/Vip');
const Order = require('./pos/Order');

module.exports = app => {
    // ------------------- mock数据 -------------------
    // /** 用户登录 */
    // app.post('/damai-svr/smpos/user/login', (req, resp) => {
    //     User.login(req, resp);
    // });
    // /** 通过条码获取商品详情 */
    // app.get('/prd-svr/prd/productspeccode/barcode', (req, resp) => {
    //     Goods.getGoodsDetailByBarcode(req, resp);
    // });
    // /** 设置会员信息,这里获取和用户登录一样的数据 */
    // app.post('/pos-svr/setVipInfo', (req, resp) => {
    //     Vip.setVipInfo(req, resp);
    // });
    // app.post('/pos-svr/setVipInfoById', (req, resp) => {
    //     Vip.setVipInfoById(req, resp);
    // });
    // /** 订单支付 */
    // app.post('/ord-svr/ord/pos-payOrder', (req, resp) => {
    //     Order.payOrder(req, resp);
    // });

    // ---------------------- 代理 ----------------------
    // app.use('/ord-svr/*', proxy('http://192.168.1.16:20180'));
    //   setForward(app, 'ord-svr', 'http://192.168.1.16:20180', false);

    setForward(app, 'prd-svr', 'http://192.168.1.201/prd-svr/', false);
    setForward(app, 'ord-svr', 'http://192.168.1.201/ord-svr/', false);
    setForward(app, 'onl-svr', 'http://192.168.1.201/onl-svr/', false);
    setForward(app, 'damai-svr', 'http://192.168.1.201/damai-svr/', false);
    

 
    // setForward(app, 'prd-svr', 'http://www.duamai.com/prd-svr/', false);
    // setForward(app, 'ord-svr', 'http://www.duamai.com/ord-svr/', false);
    // setForward(app, 'onl-svr', 'http://www.duamai.com/onl-svr/', false);
    // setForward(app, 'damai-svr', 'http://www.duamai.com/damai-svr/', false);
};

/**
 * 设置代理转发
 * @param {*} app express的实例
 * @param {string} microSvcName 微服务的名称
 * @param {string} targetHost 代理转发的目的Host地址
 * @param {boolean} isPassGateway 是否经过网关(不经过网关转发的地址应减去微服务的名称)
 */
function setForward(app, microSvcName, targetHost, isPassGateway) {
    if (isPassGateway) {
        app.use(
            `^/${microSvcName}/*`,
            proxy({
                target: targetHost,
                onProxyReq: restream, // express.json()插件会影响到代理转发，所以代理转发时要进行手动转发header和body部分
            })
        );
    } else {
        app.use(
            `^/${microSvcName}/*`,
            proxy({
                target: targetHost,
                pathRewrite: {
                    [`^/${microSvcName}`]: '', // 删除掉微服务名称
                },
                onProxyReq: restream, // express.json()插件会影响到代理转发，所以代理转发时要进行手动转发header和body部分
            })
        );
    }
}

/**
 * express.json()插件会影响到代理转发，所以代理转发时要进行手动转发header和body部分
 */
function restream(proxyReq, req, res, options) {
    if (req.body) {
        let bodyData = JSON.stringify(req.body);
        // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
        proxyReq.setHeader('Content-Type', 'application/json');
        // eslint-disable-next-line no-undef
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        // stream the content
        proxyReq.write(bodyData);
    }
}
