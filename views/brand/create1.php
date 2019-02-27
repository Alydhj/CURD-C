<?php
use yii\helpers\Url;
?>
<!DOCTYPE html>
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <form action="<?= Url::to(['brand-api/create1']) ?>" success-url="<?= Url::to(['brand/index']) ?>" method="post" id="data-form">
            <table border="1">
                <tr>
                    <td>品牌名称</td>
                    <td><input type="text" name="xxxxxxxx"/></td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <input type="button" value="提交" id="sub-btn"/>
                    </td>
                </tr>
            </table>
        </form>
        <script type="text/javascript" src="./js/jquery.min.js"></script>
        <script type="text/javascript" src="./js/base.js"></script>
    </body>
</html>
