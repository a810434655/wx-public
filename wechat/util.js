"use strict"
var xml2js=require("xml2js");
var Pomise=require("bluebird");
//定义一个方法暴露出去使用
exports.parseXMLAsync=function (xml) {
    //new Pomise来等待参数
     return new Pomise(function (resolve,reject) {
         //xml2js接受xml数据 如何接受失败返回err接受成功返回content
         xml2js.parseString(xml,{trim:true},function (err,content) {
             if(err) reject(err);
             else resolve(content);
         })
     })
}
function formatMessage(result){
    var message={}
    if(typeof result === "object"){
        var keys=Object.keys(result);
        for(var i=0;i<keys.length;i++){
            var item=result[keys[i]];
            var key=keys[i]
            if(!(item instanceof Array) || item.length=== 0){
                continue
            }
            if(item.length===1){
                var val=item[0];

                if(typeof val === "object"){
                    message[key]=formatMessage(val);
                }else{
                    message[key]=(val || "").trim();
                }
            }else{
                message[key]=[];
                for(var j=0,k=item.length;j<k;j++){
                    message[key].push(formatMessage(item[j]));
                }
            }
        }
    }
     return message;
}
exports.formatMessage=formatMessage;