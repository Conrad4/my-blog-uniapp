/**
 * 请求的目的是是什么？把url，数据，发送请求，或者get请求接收响应，把响应的数据返回给调用者
 * 往这个函数里面传递什么？
 * 这个解构赋值
 */
const BASE_URL = 'https://api.imooc-blog.lgdsunday.club/api';

function request({ data, url, method = 'GET' }) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: '',
            data,
            header: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            method: 'GET',
            sslVerify: true,
            success: ({ data, statusCode, header }) => {
                // 看后端接口文档返回的是什么
                if (data.success) {
                    // 操作成功，将数据返回出去
                    resolve(data);
                } else {
                    uni.showToast({
                        title: data.message,
                        icon: 'none',
                        mask: true,
                        duration: 3000,
                    });
                    reject(data.message);
                }
            },
            fail: (error) => {
                reject(error);
            },
        });
    });
}

export default request;
