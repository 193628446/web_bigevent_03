$(function () {
    // 自定义验证规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1~6位之间"
            }
        }
    })

    // 用户渲染
    initUserInfo();
    var layer = layui.layer;
    // 封装函数 获取用户的基本信息渲染用户信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //console.log(res);
                //成功后 渲染
                form.val('formUserInfo', res.data)
            }
        });
    }

    // 重置 给form表单绑定 reset 事件， 给重置按钮绑定click 事件
    $('#btnReset').on('click', function (e) {
        // 阻止默认事件
        e.preventDefault();
        // 重新渲染
        initUserInfo();
    })
    
    // 提交用户信息
    var layer = layui.layer;
    $('.layui-form').on('submit', function (e) {
        // 阻止浏览器的默认行为 
        e.preventDefault();
        // 发送ajax 请求 修改用户信息
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败! ')
                }
                layer.msg('修改用户信息成功！')
                //调用父页面中更新用户信息和头像的方法
                window.parent.getUserInfo();
            }
        });
    })

})