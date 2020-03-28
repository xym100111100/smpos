let express = require('express');

// 创建express实例
let app = express();

app.use(express.static('static')); // 指定静态资源所在的目录
app.use(express.json()); // 解析json格式的数据，但是这个插件会影响到代理转发

// 允许跨域
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    // 此处根据前端请求携带的请求头进行配置
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    // 例如： 我们公司的请求头需要携带Authorization和Client-Type，此处就应该按照以下进行配置
    // res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Authorization, Client-Type");
    next();
});

// 引入路由
require('./route')(app);

// 服务器监听端口
const port = 3000;

// 监听端口, 创建服务器
app.listen(port, () => {
    console.log('****************************************');
    console.log(`mock server started and listening on port ${port}`);
    console.log('****************************************');
});
