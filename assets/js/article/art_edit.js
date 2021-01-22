$(function () {
    // 设置表单信息
    // 用等号切割 然后使用后面的值
    // alert(location.search.split('=')[1])
    function initForm() {
        var id = location.search.split("=")[1];
        $.ajax({
            method: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                // 失败判断
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染到 form 表单中
                form.val('form-edit', res.data);
                // tinyMCE 赋值 百度
                tinyMCE.activeEditor.setContent(res.data.content)
                if (!res.data.cover_img) {
                    return layer.msg("用户未曾上传头像! ")
                }
                var newImgURL = baseURL + res.data.cover_img;
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        });
    }

    // 初始化分类
    var form = layui.form;      //导入form
    var layer = layui.layer;    //导入layer
    initCate();
    // f封装
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                form.render();
                // 文章分类渲染后在调用
                initForm()
            }
        });
    }

    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击按钮 选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 设置图片
    $('#coverFile').change(function (e) {
        var file = e.target.files[0];
        if (file == undefined) {
            return;
        }
        // 根据选择的文件 创建一个对应的url地址
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 设置状态
    // 初始值为已发布
    var state = "已发布";
    // $('#btnSave1').on('click', function () {
    //     state = "已发布"
    // })
    $('#btnSave2').on('click', function () {
        state = "草稿"
    })

    // 添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 创建formdata(this) 收集数据
        var fd = new FormData(this)
        // 放入状态
        fd.append("state", state);
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存储到fd中
                fd.append('cover_img', blob)
                // console.log(...fd);
                // 发送ajax 要写在函数里面
                publishArticle(fd)
            })
    })
    // 封装  添加文字方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/edit",
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 提示消息  页面跳转
                layer.msg("恭喜您，修改文章成功")
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 1500)
            }
        });
    }
})