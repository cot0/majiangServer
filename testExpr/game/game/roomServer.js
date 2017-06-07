var cardUtil = require("./cardUtil");
var wss = require("../../socket/websocket");
var commands = require("../../socket/commands");

var RoomServer = function () {
}
var p = RoomServer.prototype;
/**4个玩家*/
p.players = [];
/**牌组*/
p.leftCards = [];
/**发牌间隔*/
p.dealCardTime = 300;
/**玩家0的牌*/
p.cards0 = [];
/**玩家1的牌*/
p.cards1 = [];
/**玩家2的牌*/
p.cards2 = [];
/**玩家3的牌*/
p.cards3 = [];
/**当前出牌的人 默认0*/
p.curPlayIndex = 0;
/**当前房间状态 1234*/
p.state = 0;
/**发牌*/
p.STATE_DEALCARD = 1;
/**出牌*/
p.STATE_PLAYCARD = 2;
/**碰/杠/胡/过 牌*/
p.STATE_PENGCARD = 3;
/**结算*/
p.STATE_PAYOUT = 4;


/**设置玩家*/
p.setPlayers = function (players) {
    this.players = players;
}
/**初始游戏*/
p.initGame = function () {
    this.leftCards = cardUtil.getNewCards108();

    var self = this;
    this.initDealCard(0 , 4, 0);
    this.initDealCard(1 , 4, 1);
    this.initDealCard(2 , 4, 2);
    this.initDealCard(3 , 4, 3);
    this.initDealCard(0 , 4, 4);
    this.initDealCard(1 , 4, 5);
    this.initDealCard(2 , 4, 6);
    this.initDealCard(3 , 4, 7);
    this.initDealCard(0 , 4, 8);
    this.initDealCard(1 , 4, 9);
    this.initDealCard(2 , 4, 10);
    this.initDealCard(3 , 4, 11);
    this.initDealCard(0 , 2, 12);
    this.initDealCard(1 , 1, 13);
    this.initDealCard(2 , 1, 14);
    this.initDealCard(3 , 1, 15, function () {
        self.changeState(self.STATE_PLAYCARD);
    });
}

/**初始发牌*/
p.initDealCard = function (i,num,delay, callback) {
    var self = this;
    setTimeout(function () {
        self.dealCard(i, self.getCard(num));
        if(callback){
            callback.call(self);
        }
    },self.dealCardTime*delay);
}
/**向某个玩家发牌*/
p.dealCard = function (i, arr) {
    this["cards"+i] = this["cards"+i].concat(arr);
    wss.sendMsg(this.players[i].ws, {command:commands.STATE_DEAL_CARDS, content:{addCards:arr, leftCardsNum:this.leftCards.length}});
    //发一个人的牌时要告知另外三个人，这个人的牌数变了
    if(i != 0)wss.sendMsg(this.players[0].ws, {command:commands.STATE_DEAL_CARDS, content:{otherCardNum:{i:this["cards"+i].length}, leftCardsNum:this.leftCards.length}});
    if(i != 1)wss.sendMsg(this.players[1].ws, {command:commands.STATE_DEAL_CARDS, content:{otherCardNum:{i:this["cards"+i].length}, leftCardsNum:this.leftCards.length}});
    if(i != 2)wss.sendMsg(this.players[2].ws, {command:commands.STATE_DEAL_CARDS, content:{otherCardNum:{i:this["cards"+i].length}, leftCardsNum:this.leftCards.length}});
    if(i != 3)wss.sendMsg(this.players[3].ws, {command:commands.STATE_DEAL_CARDS, content:{otherCardNum:{i:this["cards"+i].length}, leftCardsNum:this.leftCards.length}});
}

/**改变房间装填*/
p.changeState = function (n) {
    if(this.state == n){
        return;
    }
    this.state = n;
    switch (n){
        case this.STATE_DEALCARD:
           break;
        case this.STATE_PLAYCARD:
            //告知4个人 出牌状态 该谁出牌
            this.sendToRoomPlayers({command:commands.STATE_PLAY_CARD, content:{index:this.curPlayIndex}});
            break;
        case this.STATE_PENGCARD:
            this.checkPeng();
            break;
        case this.STATE_PAYOUT:
            break;
    }
}
/**
 * 在出牌之后 检查是否可以 碰/杠/胡
 * i:谁出的牌 card:出的什么牌
 * */
p.checkPeng = function (i,card) {
    
}


/**从牌组的开始取n张牌*/
p.getCard = function (n) {
    if(this.leftCards.length < n) return;

    var arr = [];
    for(var i=0;i<n;i++){
        arr.push(this.leftCards.shift());
    }
    return arr;
}
/**向房间内的4个人发送消息*/
p.sendToRoomPlayers = function (data) {
    for(var i=0; i<this.players.length; i++){
        wss.sendMsg(this.players[i].ws, data);
    }
}

module.exports = RoomServer;
