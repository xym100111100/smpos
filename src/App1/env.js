const env = {
    /** 后端服务器地址 */
    BASE_URL: '',
    /** 图片URL基础路径 */
    PIC_BASE_URL: '',
    /** 安卓ApiKey */
    API_KEY: '',
    /** 领域ID */
    DOMAIN_ID: 'bussness',
    /** 系统ID */
    SYS_ID: 'wbl-smpos',
};

console.log('env.NODE_ENV:', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
     env.BASE_URL = 'http://192.168.1.201';
    //env.BASE_URL = 'http://192.168.1.200:3000';
    // env.BASE_URL = 'http://192.168.43.178:3000';
    // env.BASE_URL = 'http://192.168.1.16:3000';
    env.PIC_BASE_URL = 'http://192.168.1.201/ise-svr/files';


} else if (process.env.NODE_ENV === 'production') {
    env.BASE_URL = 'https://www.duamai.com';
    env.PIC_BASE_URL = 'https://www.duamai.com/ise-svr/files';
}

console.log('env', env);

export default env;
