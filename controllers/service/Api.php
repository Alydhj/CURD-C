<?php
namespace app\controllers\Service;
class Api {

    const KEY = '!@#$%^&*()_+1607phpC'; //加密的密钥
    
    const SIGN_KEY = 'sign';

    public static function checkSign($param){
        if(!array_key_exists(self::SIGN_KEY, $param)){
            return self::response(500, '非法访问');
        }
        $sign = $param[self::SIGN_KEY];
        unset($param[self::SIGN_KEY]);
        foreach($param as $key => $val){
            if($val === ''){
                unset($param[$key]);
            }
        }
        ksort($param);
        $query = [];
        foreach($param as $key => $val){
            $query[] = $key . '=' . $val;
        }
        $query = implode('&', $query);
        $sign_ = md5($query . self::KEY);
        if($sign_ != $sign){
            return self::response(500, '签名错误');
        }
    }
    
    public static function response($code = 200, $msg = '', $data = []){
        echo json_encode([
            'code' => $code,
            'message' => $msg,
            'data' => $data,
        ]);die;
    }
    
}