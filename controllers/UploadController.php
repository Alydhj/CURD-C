<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;

class UploadController extends Controller {

    public $layout = false;
    public $enableCsrfValidation = false;

    public function actionUpload() {
        $file = $_FILES['upload_file'];
        if ($file['error'] == 0) {
            $filename = time() . rand(100, 999) . '.jpg';
            $filePath = './uploads/';
            move_uploaded_file($file['tmp_name'], $filePath . $filename);
            echo $filePath . $filename;
            exit();
        }
        echo 0;
        exit();
    }

}
