// 入口函数
$(function () {
    // 文章类别列表展示
    initArtCateList();

    // 封装函数
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-art-cate', res);
                $('tbody').html(htmlStr)
            }
        });
    }

    // 显示添加文章分类列表
    var layer = layui.layer;
    $('#btnAdd').on('click', function () {
        // 利用 弹出层 框架代码 显示提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,    //代表页面层
            area: ['500px', '250px'],    //弹出层宽度和高度
            title: '添加文字类别',
            content: $('#dialog-add').html(),
        })
    })

    // 通过代理的形式 为form-add表单绑定submit 事件
    // 弹出层是后添加的 父盒子就是 body 不能直接绑定
    var layer = layui.layer;
    var indexAdd = null;
    $('body').on('submit', "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            // 自动获取表单里面的值
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                // 如果返回失败
                if (res.status !== 0) {
                    return layer.msg(res.meaaage)
                }
                // 添加成功后渲染页面
                initArtCateList();
                layer.msg('恭喜您，文章类别添加成功! ')
                // 关闭弹出层
                layer.close(indexAdd)
            }
        });
    })

    // 通过代理的形式 为btn-edit 点击编辑的时候 必须是类名
    var indexEdit = null;
    var form = layui.form;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,    //代表页面层
            area: ['500px', '250px'],    //弹出层宽度和高度
            title: '修改文章类别',
            content: $('#dialog-edit').html(),
        })
        // 通过自定义属性 获取自定义属性发送ajax都要写到点击事件里面
        var Id = $(this).attr('data-id');
        $.ajax({
            method: "GET",
            // 路径后面加/ 后面是字符串的拼接
            url: "/my/article/cates/" + Id,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                form.val('form-edit', res.data)
            }
        });
    })

    // 通过代理的形式绑定提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 因为我们更新成功了 所以要重新渲染页面中数据
                initArtCateList();
                layer.msg('恭喜您，文章类别更新成功! ')
                layer.close(indexEdit)
            }
        });
    })

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id');
        // 显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' },
            function (index) {
                $.ajax({
                    method: "GET",
                    url: "/my/article/deletecate/" + Id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        initArtCateList();
                        layer.msg('恭喜您，文章类别删除成功! ')
                        layer.close(index)
                    }
                });
            })
    })
})
