var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 8181 });
var WsPool = require("./wsPool");
var clients = new WsPool();
var indexs = [];
var msgHandler = require("./msgHandler");


wss.on('connection', function (ws) {
    someoneConnected(ws);
});

/**当一个客户连接上socket*/
function someoneConnected(ws) {
    addWs(ws);

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
    try {
        var data = JSON.parse(msg);
    }
    catch (e){
        console.log("消息格式错误 "+e);
    }
    var command = data.command;
    msgHandler.dispatch(command, ws, data);
}



/**向一个客户发送消息*/
exports.sendMsg = function (ws, msg) {
    console.log("向一个客户发出消息 "+msg);
    ws.send(msg);
}
/**向所有客户发送消息*/
exports.sendAll = function (msg) {
    console.log("向所有客户发出消息 "+msg);
    var all = clients.getValues();
    for(var i=0; i<all.length; i++){
        all(i).send(msg);
    }
}
