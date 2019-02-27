<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use app\controllers\Service\Api;

class BrandApiController extends Controller {

    public $layout = false;
    public $enableCsrfValidation = false;
    
    private $param;


    public function init() {
        if (Yii::$app->request->isPost) {
            $this->param = Yii::$app->request->post();
        } else {
            $this->param = Yii::$app->request->get();
        }
        Api::checkSign($this->param);
        unset($this->param['sign']);
    }

    public function actionIndex() {
        
    }

    public function actionCreate() {
        $res = Yii::$app->db->createCommand()->insert('brand', $this->param)->execute();
        if($res){
            return Api::response();
        }
        return Api::response(500, '入库失败');
    }

    public function actionCreate1() {
        $res = true;
        if($res){
            return Api::response();
        }
        return Api::response(500, '入库失败');
    }
}
