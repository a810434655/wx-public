"use strict"
//引入哈希加密插件
var sha1=require("sha1");
// 引入Access构造函数
var Wechat=require("./wechat");
//引入raw-body模块
var getRawBody=require("raw-body");

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
       if(this.method==="GET"){
           console.log("29");
           if(sha===signature){
               this.body=ecostr+"";
           }else{
               this.body="不是微信后台传来的数据源"
           }
       }else if(this.method==="POST"){
           if(sha!==signature){
               console.log("36");
               this.body="NO";
               return false
           }
           var data=yield getRawBody(this.req,{
               length:this.length,
               limit:"1mb",
               encoding:this.charset,
           })
          console.log(data.toString())
       }

    }
}


