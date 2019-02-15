"use strict"
var sha1=require('sha1');
function Wechat(opts){
    var that=this;
    this.appID=opts.appSecret;
    this.getAccessToken=opts.getAccessToken;
    this.savaAccessToken=opts.savaAccessToken;
    this.getAccessToken().then(function (data) {
        try{
            data=json.parse(data)
        }
        catch(e){
          return that.updateAccessToken(data);
        }
        if(that.isValidAccessToken(data)){
         Promise.resolve(data)
        }else{
            return that.updateAccessToken();
        }
    })
        .then(function (data) {
            that.access_token=data.access_token;
            that.expires_in=data.expires_in;
            that.savaAccessToken(data)
        })
}
Wechat.prototype.isValidAccessToken=function(data){
    if(!data || data.access_token || !data.expires_in){
        return false
    }
    var access_token=data.access_token;
    var expires_in=data.expires_in;
    var now=(new Date().getTime());
    if(now<expires_in){
        return true
    }else{
        return false
    }
}
Wechat.prototype.updateAccessToken=function(data){
    if(!data || data.access_token || !data.expires_in){
        return false
    }
    var access_token=data.access_token;
    var expires_in=data.expires_in;
    var now=(new Date().getTime());
    if(now<expires_in){
        return true
    }else{
        return false
    }
}
module.exports=function(wechat){
    return function *(next) {
        console.log(this.query)
        var token=wechat.token;
        var signature=this.query.signature;
        var nonce=this.query.nonce;
        var timestamp=this.query.timestamp;
        var echostr=this.query.echostr;
        var str=[token,timestamp,nonce].sort().join("");
        var sha=sha1(str);
        if(sha===signature){
            this.body=echostr+''
        }else{
            this.body="wrong"
        }
    }
}
