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
        $where = ' where 1=1';
        if(isset($this->param['brand_name']) && !empty($this->param['brand_name'])){
            $where .= ' and brand_name like "%'.$this->param['brand_name'].'%"';
        }
        if(isset($this->param['brand_type']) && !empty($this->param['brand_type'])){
            $where .= ' and brand_type = ' . $this->param['brand_type'];
        }
        $sql .= $where;
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

    public function actionUpdate(){
        $table = $this->param['table'];
        $pk = $this->param['pk'];
        $id = $this->param['id'];
        $column = $this->param['column'];
        $data = $this->param['data'];
        $res = Yii::$app->db->createCommand()->update($table, [
            $column => $data
        ], [
            $pk => $id
        ])->execute();
        if($res){
            return Api::response();
        }
        return Api::response(500, '入库失败');
    }
    
    public function actionCreate() {
        $res = Yii::$app->db->createCommand()->insert('brand', $this->param)->execute();
        if($res){
            return Api::response();
        }
        return Api::response(500, '入库失败');
    }
}
