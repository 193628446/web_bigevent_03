$(function () {
    // 点击去注册账号 显示 注册页面
    $('#link_reg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    })
    // 点击去登录 显示登录 隐藏注册
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // 自定义验证功能
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var pwd = $('.reg-box input[name=password]').val();
            if (value !== pwd) {
                return '两次密码不一致'
            }
        }
    })
     
    // 注册功能
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: "/api/reguser",
            data: {
                username: $('.reg-box input[name=username]').val(),
                password: $('.reg-box input[name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功 请登录');
                // 手动切换到登录
                $('#link_login').click();
                // 重置表单
                $('#form_reg')[0].reset();
            }
        });
    })

    // 登录功能
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
                localStorage.setItem('token', res.token)
                location.href = '/index.html';
            }
        });
    })
})