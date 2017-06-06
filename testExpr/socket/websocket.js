var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8181 });
var WsPool = require("./wsPool");
var clients = new WsPool();
var indexs = [];
var commands = require("./commands");
var loginServer = require("../game/loginServer");
var gameServer = require("../game/gameServer");

Buffer.prototype.toByteArray = function () {
    return Array.prototype.slice.call(this, 0);
}

wss.on('connection', function (ws) {
    someoneConnected(ws);
});

/**当一个客户连接上socket*/
function someoneConnected(ws) {
    addWs(ws);
    sendMsg(ws, JSON.stringify({command:commands.SYSTEM_MSG, content:{msg:"我知道你连上了"}}));

    ws.on('message', function (message) {
        onMessage(ws, message);
    });
    ws.on('close', function () {
        removeWs(ws.clientid);
    })
}
/**保存一个客户连接*/
function addWs(ws) {
    var i = 1;
    while(indexs.indexOf(i) > -1){
        i++;
    }
    console.log("有人连上了，他的index 是 "+i);
    indexs.push(i);
    ws.clientid = i;
    clients.setValue(i,ws);
}
/**删除一个客户连接*/
function removeWs(i) {
    console.log("有人断开了 他的index是 "+i);
    var index = indexs.indexOf(i);
    indexs.splice(index,1);
    clients.removeKey(i);
}

/**
 * 收到一个客户的消息
 * */
function onMessage(ws, msg) {
    console.log("客户 "+ws.clientid+" 发消息了 "+msg);
    var data = JSON.parse(msg);
    var command = data.command;
    var sqs = data.sequence;
    switch (command){
        case commands.REGISTER:
            loginServer.register(data.content.name, data.content.password, function (errcode, result) {
                if(errcode){
                    console.log("注册错误 "+errcode);
                    var respTxt = JSON.stringify({command:commands.REGISTER, code:errcode, sequence:sqs});
                    sendMsg(ws, respTxt);
                }
                else{
                    //注册成功
                    var respTxt = JSON.stringify({command:commands.REGISTER, code:0, sequence:sqs});
                    sendMsg(ws, respTxt);
                }
            });
            break;
        case commands.LOGIN:
            loginServer.login(data.content.name, data.content.password, function (errcode, result) {
                if(errcode){
                    console.log("登录错误 "+errcode);
                    var respTxt = JSON.stringify({command:commands.LOGIN, code:errcode, sequence:sqs});
                    sendMsg(ws, respTxt);
                }
                else{
                    if(result){
                        var respTxt = JSON.stringify({command:commands.LOGIN, code:0, sequence:sqs});
                        sendMsg(ws, respTxt);
                    }
                }
            })
            break;
    }

}
/**向一个客户发送消息*/
function sendMsg(ws, msg) {
    ws.send(msg);
}

/**向所有客户发送消息*/
function sendAll(msg) {
    var all = clients.getValues();
    for(var i=0; i<all.length; i++){
        all(i).send(msg);
    }
}
