/**
 * 路由 处理http get post put delete
 */
var path = require("path");
module.exports = function (app) {

    app.get('/login/:name?', function (req, resp) {
        var ip = req.ip;
        var name = req.params.name;
        console.log("收到"+ip+"的参数 name " + name);
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.send('helloworld ' + (name ? name : "guest"));
    });


    app.get('/download/:filename?', function (req, resp) {
        var filename = req.params.filename;
        console.log("请求文件 filename " + filename);
        if(filename.length>0) {
            console.log("发送文件 filename " + filename);
            resp.sendFile(path.join(__dirname, '', 'aa.txt'));
        }
    });

    app.get('/upload', function (req, resp) {
        //获取上传的文件
        var file = req.files;
        console.log("获取上传的文件 " + file);
    });

    app.get('/channelInfo', function (req,resp) {
        var body = "hello channel";
        resp.setHeader("Content-Type", 'text/plain');
        resp.setHeader("Content-Length", body.length);
        resp.setHeader("Server", "textRxprServer");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        resp.end(body);
    });
    app.get('/api', function (req,resp) {
        resp.send({name:"zhangsan"});
    });
}
