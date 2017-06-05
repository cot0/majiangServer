var express = require("express");
var app = express();

//设置静态资源目录
app.use(express.static(__dirname  + "/public"));
//设置路由
var routes = require("./routes/route")(app);

//连接数据库
var db = require("./db/db")(app);


app.listen(3000);
console.log("server started on 3000");
