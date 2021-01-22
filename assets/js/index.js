$(function () {
    getUserInfo();

    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
            // 框架提供的询问框
            layer.confirm('是否确认退出登录?', { icon: 3, title: '提示'}, function(index){
                // 清空本地的token
                localStorage.removeItem('token')
                // 实现页面跳转 登录页面
                location.href = '/login.html';
                // 关闭询问框
                layer.close(index);
              });       
        })
})

//获取用户基本信息 封装在入口函数的外面（全局函数）
// 因为后面其他的页面要调用
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers 就是请求头配置对象
        // headers: {
        //     // 重新登录 因为token 过期事件12小时
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 获取成功 调用avatar 渲染用户的头像
            rederAvatar(res.data)
        },
        
    });
}


// 渲染用户的头像
function rederAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 渲染头像
    if (user.user_pic !== null) {
        // 如果用户有头像 渲染图片头像 文字头像隐藏
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 没有头像 相反渲染文字头像 隐藏图片头像
        $('.layui-nav-img').hide()
        // 对应上面name 属性 第一个名称 
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}