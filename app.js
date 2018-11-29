"use strict"

var Koa=require("koa");
var wechat=require("./wechat/g");
var config={
    wechat:{
        appID:"wx1349e9c2e66242e7",
        appSecret:"68eeba1fda9b628257184b587749d774",
        token:"wupeng"
    }
}
var app = new Koa();
app.use(wechat(config.wechat));

app.listen(3200);
console.log("OK：3200");
