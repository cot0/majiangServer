var server = require("./gameServer");
var wss = require("../../socket/websocket");
var commands = require("../../socket/commands");

exports.handMsg = function (ws, data) {
    var command = data.command;
    switch (command){
        case commands.MATCH_PLAYER:
            matchPlayer(ws, data);
            break;
        case commands.PLAY_GAME:
            playGame(ws, data);
            break;
    }
}

function matchPlayer(ws, data) {
    server.matchPlayer(ws, data.content.name, data.sequence, function (err, sqs, players) {
        if(err){
        }
        else{
            var resp = {command:commands.MATCH_PLAYER, code:0, sequence:sqs, content:{players:players}};
            wss.sendMsg(ws, resp);
        }
    });
}

function playGame(ws, data) {
    server.playgame(ws, data, function (err, result) {
        if(err){

        }
        else{

        }
    });
}
