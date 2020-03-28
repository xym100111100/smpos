import axios from 'axios';
import Toast from 'react-native-root-toast';
import env from '../env';

const codeMessage = {
    ETIMEDOUT: '网络断开或服务器异常，请稍后重试',
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

// 设置axios的默认参数
axios.defaults.baseURL = env.BASE_URL;
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// request拦截器;
axios.interceptors.request.use(
    config => {
        // console.log('request', config);
        return config;
    },
    error => {
        // console.log('request error', error);
        Toast.show('网络请求出现异常!');
        return Promise.reject(error);
    }
);

/**
 * 请求
 *
 * @param {String} url 请求的地址
 * @param {Object} options 请求的选项
 */
export function request(url, options) {
    // 初始化options
    const defaultOptions = {
        // 请求的方法类型(GET/POST/PUT/DELETE)，默认为GET
        type: 'GET',
        // ********************************************
        // 请求参数:
        // 如果传入data，请求参数放入body
        // 如果传入params，请求参数加在url后面
        // ********************************************
        data: undefined,
        params: undefined,
        // 请求的headers
        headers: undefined,
    };
    const newOptions = { ...defaultOptions, ...options };

    // 请求的config
    const config = {
        url,
        method: newOptions.type.toLowerCase(),
    };
    // 如果传入data，请求参数放入body，如果传入params，请求参数加在url后面
    if (newOptions.data) config.data = newOptions.data;
    if (newOptions.params) config.params = newOptions.params;
    // 请求的headers
    if (newOptions.headers) config.headers = newOptions.headers;

    // 发出请求
    return axios
        .request(config)
        .then(resp => {
            return resp.data;
        })
        .catch(error => {
            console.log('axios request error', error);
            // 错误提示信息
            const msg =
                (error.response && error.response.status && codeMessage[error.response.status]) || '未知错误:' + error;
            return Promise.resolve({ result: 0, msg });
        });
}

/**
 * 发出GET请求
 *
 * @param {String} url 请求的地址
 * @param {Object} options 请求的选项
 */
export function get(url, options) {
    // 初始化options
    const defaultOptions = {
        type: 'GET', // 请求的方法类型(GET/POST/PUT/DELETE)，默认为GET
    };
    const newOptions = { ...defaultOptions, ...options };
    return request(url, newOptions);
}

/**
 * 发出POST请求
 *
 * @param {String} url 请求的地址
 * @param {Object} options 请求的选项
 */
export function post(url, options) {
    // 初始化options
    const defaultOptions = {
        type: 'POST', // 请求的方法类型(GET/POST/PUT/DELETE)，默认为GET
    };
    const newOptions = { ...defaultOptions, ...options };
    return request(url, newOptions);
}

/**
 * 发出PUT请求
 *
 * @param {String} url 请求的地址
 * @param {Object} options 请求的选项
 */
export function put(url, options) {
    // 初始化options
    const defaultOptions = {
        type: 'PUT', // 请求的方法类型(GET/POST/PUT/DELETE)，默认为GET
    };
    const newOptions = { ...defaultOptions, ...options };
    return request(url, newOptions);
}

/**
 * 发出DELETE请求
 *
 * @param {String} url 请求的地址
 * @param {Object} options 请求的选项
 */
export function del(url, options) {
    // 初始化options
    const defaultOptions = {
        type: 'DELETE', // 请求的方法类型(GET/POST/PUT/DELETE)，默认为GET
    };
    const newOptions = { ...defaultOptions, ...options };
    return request(url, newOptions);
}
