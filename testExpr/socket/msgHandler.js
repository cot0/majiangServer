var commands = require("./commands");
var loginHandler = require("../game/login/loginHandler");
var gameHandler = require("../game/game/gameHandler");
var events = require('events');
var emitter = new events.EventEmitter();

addEvents();

function addEvents() {
    addEvent(commands.REGISTER, loginHandler);
    addEvent(commands.LOGIN, loginHandler);
    addEvent(commands.MATCH_PLAYER, gameHandler);
}
function addEvent(command, handler) {
    emitter.on(command, function (ws, data) {
        handler.handMsg(ws, data);
    })
}

exports.dispatch = function (command, ws, data) {
    emitter.emit(command, ws, data);
}





// exports.onMsg = function (ws, data) {
//     var command = data.command;
//     switch (command){
//         case commands.REGISTER:
//             handleRegister(ws,data);
//             break;
//         case commands.LOGIN:
//             loginServer.login(data.content.name, data.content.password, function (errcode, result) {
//                 if(errcode){
//                     console.log("登录错误 "+errcode);
//                     var respTxt = JSON.stringify({command:commands.LOGIN, code:errcode, sequence:sqs});
//                     sendMsg(ws, respTxt);
//                 }
//                 else{
//                     if(result){
//                         var respTxt = JSON.stringify({command:commands.LOGIN, code:0, sequence:sqs});
//                         sendMsg(ws, respTxt);
//                     }
//                 }
//             })
//             break;
//     }
// }
//
// /**向一个客户发送消息*/
// function sendMsg(ws, msg) {
//     ws.send(msg);
// }
//
//
// function handleRegister(ws, data) {
//     var sqs = data.sequence;
//     loginServer.register(data.content.name, data.content.password, function (errcode, result) {
//         if(errcode){
//             console.log("注册错误 "+errcode);
//             var respTxt = JSON.stringify({command:commands.REGISTER, code:errcode, sequence:sqs});
//             sendMsg(ws, respTxt);
//         }
//         else{
//             //注册成功
//             var respTxt = JSON.stringify({command:commands.REGISTER, code:0, sequence:sqs});
//             sendMsg(ws, respTxt);
//         }
//     });
// }
