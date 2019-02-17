"use strict"
//引入哈希加密插件
var sha1=require("sha1");
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
    if(!data || !data.access_token || !data.expires_in){
        return false
    }
    var access_token=data.access_token;
    var expires_in=data.expires_in;
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
           console.log("77行获取不到时间");
           console.log(data.body.expires_in);
           var now=(new Date().getTime());
           //生成新的国企四件
           console.log(now);
           var expires_in=now+(data.body.expires_in - 20)*1000;
           console.log(expires_in);
           data.expires_in=expires_in;
           resolve(data);
       })
   })

}

module.exports=function(opts){
    var wechat=new Wechat(opts);
    return function *(relut) {
// 微信公众号开发中，会有三个密码，第一个token是自己知道的，还有nonce是一个随机数
// ,timestamp是时间戳,这三个值通过哈希算法加密得到一个值来判断是否等于signature就可以确定数据源是不是来自于微信后台
//拿到自己定义的token
        var token=opts.token;
//拿到传过来的微信令牌
        var signature=this.query.signature;
// nonce是一个微信传来的随机数
        var noce=this.query.nonce;
//timestamp是一个微信传来的时间戳
        var timestamp=this.query.timeestamp;

        var ecostr=this.query.ecostr;
//把token和timestamp还有noce进行sort排序，然后用join把数组变成字符串
        var str = [token,timestamp,noce].sort().join("");
//在用哈希算法进行加密计算
        var sha=sha1(str);
//如何加密后的值等于微信传过来的令牌，那么就确定是微信后台传过来的值，然后进行返回
        if(sha===signature){
            this.body=ecostr+"";
        }else{
            this.body="不是微信后台传来的数据源"
        }
    }
}


