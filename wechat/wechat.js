"use strict"
//引入Promise的bluebird
var Promise=require("bluebird");
//把request Promise化
var request=Promise.promisify(require('request'));
//拿到微信的接口获取accesssToken
var prefix="https://api.weixin.qq.com/cgi-bin/token";
var api={
    accessToken:prefix+"?grant_type=client_credential"
}

// 创建一个构造函数来获取AccessToken
function Wechat(opts){
    //保存this;
    var that=this;
    //获取appID
    this.appID=opts.appID;
    //获取appSecret
    this.appSecret=opts.appSecret;
    //获取传进来的Accesstoken
    this.getAccessToken=opts. getAccessToken;
    this.saveAccessToken=opts.saveAccessToken;
    //通过异步来获取AccessToken,因为accessToken两小时刷新一次，所以失效需要重新获取
    this.getAccessToken().then(function (data) {
        try{
            data=JSON.parse(data);
        }
        catch (e) {
            return that.updateAccessToken(data);
        }
        // 判断token值是否合法 不合法更新token值
        if(that.isValidAccessToken(data)){
            Promise.resolve(data);
        }else{
            return that.updateAccessToken();
        }
    }).then(function (data) {
        //完成后把里面的token赋予自身
        that.access_token=data.access_token;
        that.expires_in=data.expires_in;
        // 最后执行后把token值存入文件里
        that.saveAccessToken(data);
    })
}

// 在构造函数上的原型链上判断access票据是否存在吗
Wechat.prototype.isValidAccessToken=function(data){
    //判断data还有access_token和时间是否过期，如果存在就不更新，不存在就判断一下
    if(!data || !data.body.access_token || !data.body.expires_in){
        return false
    }
    var access_token=data.body.access_token;
    var expires_in=data.body.expires_in;
    var now =(new Date().getTime());
    if(now<expires_in){
        return true
    }else{
        return false
    }
}
//更新accessToken方法
Wechat.prototype.updateAccessToken=function(data){
    //拿到自己的appID
    var appID= this.appID;
    // 拿到开发者密码
    var appSecret=this.appSecret;
    //然后拼接访问微信接口地址
    var url=api.accessToken+"&appid="+appID+"&secret="+appSecret;
    //
    return new Promise(function (resolve,reject) {
        request({url:url,json:true}).then(function (response) {
            var data=response;
            var shijian=new Date();
            console.log("当前时间是"+shijian.toLocaleTimeString())
            var now=(new Date().getTime());
            //生成新的过期时间
            var expires_in=now+(data.body.expires_in - 20)*1000;
            data.expires_in=expires_in;
            resolve(data);
        })
    })
}

module.exports=Wechat;