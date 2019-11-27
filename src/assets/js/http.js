/* eslint-disable no-mixed-operators */
// 引用axios
var axios = require('axios');
var qs = require('qs');
/* var defHeaders = {
    token: window.token || ''
}; */
// 自定义判断元素类型JS
function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};
// 参数过滤函数
function filterNull(o) {
    if (typeof o !== 'string') {
        for (var key in o) {
            if (o[key] === null) {
                delete o[key];
            }
            if (toType(o[key]) === 'string') {
                o[key] = o[key].trim();
            } else if (toType(o[key]) === 'object') {
                o[key] = filterNull(o[key]);
            } else if (toType(o[key]) === 'array') {
                o[key] = filterNull(o[key]);
            }
        }
    }
    return o;
}
/*
  接口处理函数
  这个函数每个项目都是不一样的
  需要根据接口的参数进行调整。参考说明文档地址：
  https://cnodejs.org/topic/5378720ed6e2d16149fa16bd
  主要是，不同的接口的成功标识和失败提示是不一致的。
  另外，不同的项目的处理方法也是不一致的，这里出错就是简单的alert
*/
function apiAxios(method, url, params, headers, cancelToken) {
    if (!headers) {
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }
    if (params) {
        params = filterNull(params);
    }
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            headers: headers,
            url: url,
            data: method === 'POST' || method === 'PUT' ? params : null,
            params: method === 'GET' || method === 'DELETE' ? params : null,
            withCredentials: false,
            cancelToken: cancelToken
        }).then(function(res) {
            if (res.status == 200) {
                resolve(res.data);
            } else {
                console.log(res);
            }
        }).catch(function(err) {
            reject(err);
        });
    });
}
// 返回在vue模板中的调用接口
export default {
    CancelToken: axios.CancelToken,
    get: function(url, params, headers, cancelToken) {
        return apiAxios('GET', url, params, headers, cancelToken);
    },
    post: function(url, params, headers) {
        return apiAxios('POST', url, params, headers);
    },
    put: function(url, params, headers) {
        return apiAxios('PUT', url, params, headers);
    },
    delete: function(url, params, headers) {
        return apiAxios('DELETE', url, params, headers);
    },
    putByQs: function(url, params, headers) {
        return apiAxios('PUT', url, qs.stringify(params), headers);
    },
    getMethod: function(host, method, params, token, type) {
        let url = host + method;
        let headers = {};
        switch (type) {
            case "noContentType":
                break;
            case "json":
                headers['Content-Type'] = "application/json;charset=UTF-8";
                break;
            case "utf8":
                headers['Content-Type'] = "application/x-www-form-urlencoded; charset=utf-8";
                break;
            default:
                headers['Content-Type'] = "application/x-www-form-urlencoded";
                break;
        }
        token && (headers.token = token) || "";
        return apiAxios('GET', url, params, headers);
    },
    postMethod: function(host, method, params, token, type) {
        let url = host + method;
        let headers = {};
        switch (type) {
            case "noContentType":
                break;
            case "json":
                headers['Content-Type'] = "application/json;charset=UTF-8";
                break;
            default:
                headers['Content-Type'] = "application/x-www-form-urlencoded";
                break;
        }
        token && (headers.token = token) || "";
        return apiAxios('POST', url, params, headers);
    },
    putMethod: function(host, method, params, token, type) {
        let url = host + method;
        let headers = {};
        switch (type) {
            case "noContentType":
                break;
            case "json":
                headers['Content-Type'] = "application/json;charset=UTF-8";
                break;
            default:
                headers['Content-Type'] = "application/x-www-form-urlencoded";
                break;
        }
        token && (headers.token = token) || "";
        return apiAxios('PUT', url, params, headers);
    },
    deleteMethod: function(host, method, params, token, type) {
        let url = host + method;
        let headers = {};
        switch (type) {
            case "noContentType":
                break;
            case "json":
                headers['Content-Type'] = "application/json;charset=UTF-8";
                break;
            default:
                headers['Content-Type'] = "application/x-www-form-urlencoded";
                break;
        }
        token && (headers.token = token) || "";
        return apiAxios('DELETE', url, params, headers);
    }
};