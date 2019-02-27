<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use app\controllers\Service\Api;
use yii\data\Pagination;
use yii\widgets\LinkPager;
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
        unset($this->param['r']);
        Api::checkSign($this->param);
        unset($this->param['sign']);
    }

    public function actionIndex() {
        $sql = 'select * from brand';
        $count = Yii::$app->db->createCommand($sql)->execute();
        $pagination = new Pagination([
            'totalCount' => $count,
            'defaultPageSize' => 2
        ]);
        $sql .= " limit {$pagination->offset},{$pagination->limit}";
        $list = Yii::$app->db->createCommand($sql)->queryAll();
        $page = LinkPager::widget([
            'pagination' => $pagination
        ]);
        return Api::response(200, 'ok', [
            'list' => $list,
            'page' => $page
        ]);
    }

    public function actionCreate() {
        $res = Yii::$app->db->createCommand()->insert('brand', $this->param)->execute();
        if($res){
            return Api::response();
        }
        return Api::response(500, '入库失败');
    }
}
