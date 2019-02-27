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
    var form = new FormData();//创建一个表单对象
    var file = $(this);
    form.append('upload_file', file[0].files[0]);
    $.ajax({
        type: 'post',
        url: '<?= Url::to(["upload/upload"])?>',
        data: form,
        contentType: false,
        processData: false,
        success: function (e) {
            if (e != 0) {
                $('#file-input').val(e);
            }
        }
    });
});