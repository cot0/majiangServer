//连接DB
var businessDB = require("../../db/businessDB");
var codes = require("../errorCode");

//匹配队列
var queue = [];

exports.matchPlayer = function (name, sqs, callback) {
    //要筛选已经在排队的人
    for(var i=0; i<queue.length; i++){
        if(queue[i].name == name){
            return;
        }
    }

    queue.push( {name: name, sqs:sqs, callback:callback} );

    if(queue.length == 4){
        var names = [queue[0].name, queue[1].name, queue[2].name, queue[3].name];
        var newArr = [queue[0], queue[1], queue[2], queue[3]];
        queue = [];

        //查询4个人 的金钱信息
        businessDB.queryUsersByNames(names, function (err, result) {
            if(err){

            }
            else{
                var players = [];
                for(var j=0;j<result.length;j++){
                    players.push({name: result[j].name, balance: result[j].balance});
                }
                for(var i=0; i<4; i++){
                    newArr[i].callback(null, newArr[i].sqs, players);
                }
            }
        })

    }

}
