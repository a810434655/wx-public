"use strict"
//引入哈希加密插件
var sha1=require("sha1");
// 引入Access构造函数
var Wechat=require("./wechat");
//引入raw-body模块
var getRawBody=require("raw-body");
var util=require("./util");

module.exports=function(opts){
    var wechat=new Wechat(opts);
    return function *(relut) {
        var that=this;
// 微信公众号开发中，会有三个密码，第一个token是自己知道的，还有nonce是一个随机数
// ,timestamp是时间戳,这三个值通过哈希算法加密得到一个值来判断是否等于signature就可以确定数据源是不是来自于微信后台
//拿到自己定义的token
        var token=opts.token;
//拿到传过来的微信令牌
        var signature=this.query.signature;
// nonce是一个微信传来的随机数
        var noce=this.query.nonce;
//timestamp是一个微信传来的时间戳
        var timestamp=this.query.timestamp;
        var ecostr=this.query.ecostr;
//把token和timestamp还有noce进行sort排序，然后用join把数组变成字符串
        var str = [token,timestamp,noce].sort().join("");
//在用哈希算法进行加密计算
        var sha=sha1(str);
//如何加密后的值等于微信传过来的令牌，那么就确定是微信后台传过来的值，然后进行返回
        console.log("请求是"+this.method);
       if(this.method==="GET"){
           console.log("29");
           if(sha===signature){
               this.body=ecostr+"";
           }else{
               this.body="不是微信后台传来的数据源"
           }
       }else if(this.method==="POST"){
           if(sha!==signature){
               this.body="NO";
               return false
           }
           //接受xml数据;
           var data=yield getRawBody(this.req,{
               length:this.length,
               limit:"1mb",
               encoding:this.charset,
           })
           //在这里使用yield执行util.parseXMLAsync处理xml数据
           var content = yield util.parseXMLAsync(data);
           var message=util.formatMessage(content.xml);
           console.log(message);
           if(message.MsgType==="event"){
               if(message.Event==="subscribe"){
                   var now =new Date().getTime();
                   that.status=200;
                   that.type="application/xml";
                   var reply='<xml>'+
                       '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName> ' +
                       '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName> ' +
                       '<CreateTime>'+now+'</CreateTime> ' +
                       '<MsgType><![CDATA[text]]></MsgType> ' +
                       '<Content><![CDATA[你好，请问你需要帮助么，300一次]]></Content> ' +
                       '</xml>';

                    //ToUserName是谁发送给你的所以里面给message里的FromUserName
                   // CreateTime是给一个时间戳
                   // MsgType是一个类型，现在类型是text所以不用更改
                     console.log(reply);
                     that.body=reply;
                     return
               }
           }else if(message.MsgType==="text"){
               var now =new Date().getTime();
               that.status=200;
               that.type="application/xml";
               var reply='<xml>'+
                   '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName> ' +
                   '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName> ' +
                   '<CreateTime>'+now+'</CreateTime> ' +
                   '<MsgType><![CDATA[text]]></MsgType> ' +
                   '<Content><![CDATA[暂时无法提供服务]]></Content> ' +
                   '</xml>';
               //ToUserName是谁发送给你的所以里面给message里的FromUserName
               // CreateTime是给一个时间戳
               // MsgType是一个类型，现在类型是text所以不用更改
               console.log(reply);
               that.body=reply;
               return
           }

       }
    }
}


