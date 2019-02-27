document.write('<script type="text/javascript" src="./js/ksort.js"></script>');
document.write('<script type="text/javascript" src="./js/md5.js"></script>');
function setSign(param) {

    var sign_key = '!@#$%^&*()_+1607phpC';
    var param_ = [];

    var sendParam = {};
    $.each(param, function (key, value) {
        sendParam[key] = value;
        if (value !== '') {
            param_[key] = value;
        }
    });
    //引入ksort.js文件，实现ksort排序，只支持数组，返回的是一个对象
    param_ = ksort(param_);
    // join = php:implode; split = php:explode;
    var query = [];
    $.each(param_, function (k, v) {
        query.push(k + '=' + v);
    });
    query = query.join('&');
    var sign = $.md5(query + sign_key);
    sendParam.sign = sign;
    return sendParam;
}

function get(url, data, callback) {
    var param = setSign(data);
    $.ajax({
        type: 'get',
        url: url,
        data: param,
        dataType: 'json',
        success: function (e) {
            callback(e);
        }
    });
}
function post(url, data, callback) {
    var param = setSign(data);
    $.ajax({
        type: 'post',
        url: url,
        data: param,
        dataType: 'json',
        success: function (e) {
            callback(e);
        }
    });
}

function getFormData(data) {
    var param = {};
    for (var i = 0; i < data.length; i++) {
        param[data[i]['name']] = data[i]['value'];
    }
    return param;
}

$('#sub-btn').click(function () {
    var form = $('#data-form');
    var url = form.attr('action');
    var successUrl = form.attr('success-url');
    var formData = form.serializeArray();   //jquery 中 获取表单中元素的值
    var data = getFormData(formData);

    post(url, data, function (e) {
        if (e.code == 200) {
            location.href = successUrl;
            return;
        }
        alert(e.message);
    });
});
//单文件上传
$('#upload-file').change(function () {
    var file = $(this);
    upload(file, function (e) {
        if (e != 0) {
            $('#file-input').val(e);
        }
    });
});
function upload(file, callback) {
    var form = new FormData();//创建一个表单对象

    form.append('upload_file', file[0].files[0]);
    $.ajax({
        type: 'post',
        url: '?r=upload/upload',
        data: form,
        contentType: false,
        processData: false,
        success: function (e) {
            callback(e);
        }
    });
}

list_param = {};
function getData() {
    var url = $('#data-table').data('url');
    get(url, list_param, function (e) {
        if (e.code == 200) {
            var box = $('#data-box');
            box.empty();
            $.each(e.data.list, function () {
                var template = $('#data-template').html();
                $.each(this, function (key, value) {
                    template = template.replace(eval('/{{' + key + '}}/g'), value);
                });
                box.append(template);
            });
            $('#page-box').html(e.data.page);
        }
    });
}

$('#page-box').on('click', 'a', function () {
    var page = parseInt($(this).data('page')) + 1; //attr('data-page')
    list_param.page = page;
    getData();
    return false;
});

$('#search-btn').click(function () {
    var input = $('.search-input');
    for (var i = 0; i < input.length; i++) {
        list_param[input.eq(i).data('column')] = input.eq(i).val();
    }
    list_param.page = 1;
    getData();
    return;
});

old_data = null;
$(document).on('click', '.edit-td span', function () {
    var span = $(this);
    var data = span.text();
    old_data = data;
    var input = $('<input type="text" class="edit-input"/>');
    var td = span.parent();
    td.html(input);
    td.find('input').focus().val(data);
});

$(document).on('blur', '.edit-input', function () {
    var input = $(this);
    var td = input.parent();
    var data = input.val();
    edit(input, function (e) {
        if (e.code == 200) {
            td.html('<span>' + data + '</span>');
            return false;
        }
        alert(e.message);
    });
});

function edit(input, callback) {
    var td = input.parents('td');
    var data = input.val();
    if (data == '' || data == old_data) {
        td.html('<span>' + old_data + '</span>');
        return false;
    }
    // update table set column = data where pk = id
    var param = {};
    param.table = td.parents('table').data('table');
    param.pk = td.parents('table').data('pk');
    param.column = td.data('column');
    param.id = td.parent().data('id');
    param.data = data;
    get('?r=brand-api/update', param, callback);
}

edit_image = null;
$(document).on('click', '.edit-image', function () {
    edit_image = $(this);
    $('#edit-image-input').trigger('click');
});

$('#edit-image-input').change(function () {
    var file = $(this);
    upload(file, function(e){
        file.val('');
        if (e != 0) {
            edit_image.parent().append('<input type="hidden" value="' + e + '"/>');
            edit(edit_image.next(), function (ee) {
                if (ee.code == 200) {
                    edit_image.next().remove();
                    edit_image.attr('src', e);
                    return;
                }
                alert(ee.message);
            });
        }
    });
});