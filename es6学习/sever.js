const koa=require("koa");
const mysql=require("koa-mysql");
let db=mysql.createPool({host:"localhost",user:"root",password:"root",database: "blogs"})
let server=new koa();
server.use(function *() {
    let data=yield db.query('select * from web_content');
    this.body=data;
})
server.listen(8080);