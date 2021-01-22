$(function () {
    //初始化文章列表
    var layer = layui.layer;
   
    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr);
        // 年月日
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        // 时分秒
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 在个位数的左侧填充0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    
    // 定义提交参数
    var q = {
        pagenum: 1,       //页码值
        pagesize: 2,       //每页显示多少条数据
        cate_id: "",      //文章分类的Id
        state: ""       //文章的状态 可选值有：已发布、草稿
    }

    initTable();
    // 封装初始化文章列表数据
    function initTable() {
        $.ajax({
            method: "GET",     //可以不写
            url: "/my/article/list",
            data: q,     //对应上面的参数
            success: function (res) {
                //    console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败! ')
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用分页
                renderPage(res.total);
            }
        });
    }
    
    // 初始化分类 导入form
    var form = layui.form;
    initCate();
    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                } 
                // 赋值 渲染form
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // form.render() 就是根据 select 标签生成/渲染 dl放dd 
                // 如果我们赋值之后，发现数据没有同步出来，就可以调用 form.render() 
                form.render();
            }
        });
    }

    // 为筛选按钮绑定提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        // 赋值
        q.state = state;
        q.cate_id = cate_id;
        // 初始化文章列表
        initTable();
    })

    // 分页按钮
    function renderPage(total) {
        // alert(total)
        var laypage = layui.laypage;
        laypage.render({
            elem: 'pageBox' ,     //注意，这里的 test1 是 ID，不用加 # 号
            count: total,            //数据总数，从服务端得到
            limit: q.pagesize,      //每页几条
            curr: q.pagenum,        //第几页

            // 分页模块的设置
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],    //每页显示多少条数据的选择器

            //分页发生切换的时候 触发jump 回调
            // 触发jump 回调有两种：
            // 1、点击页码的时候就会触发
            // 2、只要调用layPage.render()方法就会触发jump 回调
            jump: function (obj, first) {
                // first 是否是第一次初始化分页
                // 如果first 的值为true 证明是方式二触发的 
                // 否则就是方式一触发的 需要调用initTable() 函数
                console.log(first);    //true
                console.log(obj.curr);  //页码值
                // 把最新的页码值赋值到q 这个查询参数中
                q.pagenum = obj.curr;
                // 把最新的条目数 赋值到q 这个查询参数中
                q.pagesize = obj.limit;
                // 进行判断 
                // 如果为false 就调用这个函数 
                if (!first) {
                    // 初始化文章列表
                    initTable();
                }
            } 
          });
    }

    // 通过代理的形式为删除按钮绑定事件
    var layer = layui.layer;
    $('tbody').on('click', ".btn-delete", function () {
        // 先获取id 进入到函数中的this 指向就改变了
        var Id  = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 更新成功 要重新渲染页面中的数据
                    layer.msg('恭喜您，文章删除成功! ');
                     // 当前页减1 满足两个条件： 页面只有一个元素 当前页大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    // if ($('tbody tr').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            });
            // 关闭弹窗
            layer.close(index);
          });
    })
})