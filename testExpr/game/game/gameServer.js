//连接DB
var businessDB = require("../../db/businessDB");
var codes = require("../errorCode");
var RoomServer = require("./roomServer");

//匹配队列
var queue = [];
//当前的房间些
var rooms = [];

exports.matchPlayer = function (ws, name, sqs, callback) {
    //要筛选已经在排队的人
    for(var i=0; i<queue.length; i++){
        if(queue[i].name == name){
            return;
        }
    }

    queue.push( {ws: ws, name: name, sqs: sqs, callback:callback} );

    if(queue.length == 4){
        var names = [queue[0].name, queue[1].name, queue[2].name, queue[3].name];
        var newArr = [queue[0], queue[1], queue[2], queue[3]];
        queue = [];

        //查询4个人 的金钱信息
        businessDB.queryUsersByNames(names, function (err, result) {
            if(err){

            }
            else{
                /**返回给前端的玩家数组*/
                var players = [];
                for(var j=0;j<result.length;j++){
                    players.push({name: result[j].name, balance: result[j].balance});
                }
                for(var i=0; i<4; i++){
                    newArr[i].callback(null, newArr[i].sqs, players);
                }

                /**服务端一个游戏房间要用的玩家数组*/
                var serverPlayers = [];
                for(var j=0;j<result.length;j++){
                    serverPlayers.push({ws:newArr[j].ws,  name: result[j].name});
                }
                var room = new RoomServer();
                room.setPlayers(serverPlayers);
                room.initGame();
            }
        })

    }

}
