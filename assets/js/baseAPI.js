// 每次调用 $.get() 或者$.ajax() 会先调用这个函数
var baseURL = 'http://api-breakingnews-web.itheima.net';
$.ajaxPrefilter(function (options) {
    // 获取到ajax 的所有参数
    // alert(options.url)
    // 添加路径前缀
    options.url = baseURL + options.url;

    // 统一为有权限的接口 设置headers 请求头
    // 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，
    // 才能正常访问成功
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    
    // 登录拦截 不登录不允许访问其他页面
    options.complete = function (res) {
        // console.log(res);
        var obj = res.responseJSON;
        if (obj.status === 1 && obj.message === '身份认证失败！') {
            // 清空token 
            localStorage.removeItem('token')
            // 强制跳转登录页面
            location.href = '/login.html'

        }
    }
})