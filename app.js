"use strict"
//引入koa插件
var Koa=require("koa");
//引入path插件
var path=require("path");
// 引入中间件wechat
var wechat=require("./wechat/g");
// 引入写入util文件
var util=require("./libs/util");
//读取存accessToken的文件
var wechat_file=path.join(__dirname,'./config/wechat.txt');

var config={
    wechat:{
        // 开发者appID
        appID:"wx1349e9c2e66242e7",
        //开发者密码
        appSecret:"68eeba1fda9b628257184b587749d774",
        //配置的token
        token:"wupeng",
        //获取accesstoken的方法
        getAccessToken:function () {
           return util.readFileAsyns(wechat_file);
        },
        //保存accesstoken的方法
        saveAccessToken:function (data) {
           data=JSON.stringify(data);
           return util.writeFileAsyns(wechat_file,data);
        }
    }
}
 //koa实例化为app
var app=new Koa();
//设置一个中间件
app.use(wechat(config.wechat));
//监听3000端口
app.listen(3000);
console.log("成功"+"3000端口");