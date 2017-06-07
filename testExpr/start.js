var express = require("express");
var app = express();

//设置静态资源目录
app.use(express.static(__dirname  + "/public"));
//设置路由
var routes = require("./routes/route")(app);
//启动游戏服
var loginServer = require("./game/login/loginServer");

//启动socket
var wss = require("./socket/websocket");

app.listen(3000);
console.log("server started on 3000");
