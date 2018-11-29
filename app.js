"use strict"

var Koa=require("koa");
var sha1=require('sha1');
var config={
    wechat:{
        appID:"wx1349e9c2e66242e7",
        appSecret:"68eeba1fda9b628257184b587749d774",
        token:"wupeng"
    }
}
var app = new Koa()

app.use(function *(next) {
    console.log(this.query)
    var token=config.wechat.token;
    var signature=this.query.signature;
    var nonce=this.query.nonce;
    var timestamp=this.query.timestamp;
    var echostr=this.query.echostr;
    var str=[token,timestamp,nonce].sort().join("")
    var sha=sha1(str);
    if(sha===signature){
        console.log("进入"+echostr);
        this.body=echostr+''
    }else{
        console.log(sha);
        console.log("失败"+token);
        this.body="wrong"
    }
})
app.listen(3200);
console.log("OK：3200");
