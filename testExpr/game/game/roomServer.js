var cardUtil = require("./cardUtil");
var wss = require("../../socket/websocket");
var commands = require("../../socket/commands");

var RoomServer = function () {
}
var p = RoomServer.prototype;
p.roomId = parseInt(Math.random()*100000000);
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
/**玩家0的定缺*/
p.lackCard0 = "";
/**玩家1的定缺*/
p.lackCard1 = "";
/**玩家2的定缺*/
p.lackCard2 = "";
/**玩家3的定缺*/
p.lackCard3 = "";
/**当前出牌的人 默认0*/
p.curPlayIndex = 0;
/**当前房间状态 01234*/
p.state = 0;
/**发牌*/
p.STATE_DEALCARD = 0;
/**定缺*/
p.STATE_LACKCARD = 1;
/**出牌*/
p.STATE_PLAYCARD = 2;
/**碰/杠/胡/过 牌*/
p.STATE_PENGCARD = 3;
/**结算*/
p.STATE_PAYOUT = 4;

/**向玩家发送的状态码 0发牌 1定缺 2出牌 3碰杠胡过 4结算*/
p.playCommand_sendCard = 0;
p.playCommand_lackCard = 1;
p.playCommand_playCard = 2;
p.playCommand_handleCard = 3;
p.playCommand_payout = 4;

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
        self.changeState(self.STATE_LACKCARD);
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
    wss.sendMsg(this.players[i].ws, {command:commands.PLAY_GAME, content:{state:this.playCommand_sendCard,addCards:arr, leftCardsNum:this.leftCards.length}});
    //发一个人的牌时要告知另外三个人，这个人的牌数变了
    if(i != 0)wss.sendMsg(this.players[0].ws, {command:commands.PLAY_GAME, content:{state:this.playCommand_sendCard,otherCardNum:{i:this["cards"+i].length}, leftCardsNum:this.leftCards.length}});
    if(i != 1)wss.sendMsg(this.players[1].ws, {command:commands.PLAY_GAME, content:{state:this.playCommand_sendCard,otherCardNum:{i:this["cards"+i].length}, leftCardsNum:this.leftCards.length}});
    if(i != 2)wss.sendMsg(this.players[2].ws, {command:commands.PLAY_GAME, content:{state:this.playCommand_sendCard,otherCardNum:{i:this["cards"+i].length}, leftCardsNum:this.leftCards.length}});
    if(i != 3)wss.sendMsg(this.players[3].ws, {command:commands.PLAY_GAME, content:{state:this.playCommand_sendCard,otherCardNum:{i:this["cards"+i].length}, leftCardsNum:this.leftCards.length}});
}

/**改变房间状态*/
p.changeState = function (n) {
    if(this.state == n){
        return;
    }
    this.state = n;
    switch (n){
        case this.STATE_DEALCARD:
           break;
        case this.STATE_LACKCARD:
            //告知4个人 定缺
            this.sendToRoomPlayers({command:commands.PLAY_GAME, content:{state:this.playCommand_lackCard}});
            break;
        case this.STATE_PLAYCARD:
            //告知4个人 出牌状态 该谁出牌
            this.sendToRoomPlayers({command:commands.PLAY_GAME, content:{index:this.curPlayIndex}});
            break;
        case this.STATE_PENGCARD:
            this.checkPeng();
            break;
        case this.STATE_PAYOUT:
            break;
    }
}


p.haddlePlayerQuest = function (index, data) {
    var state = data.content.state;
    switch (state){
        case this.playCommand_lackCard:
            this.handlePlayerLackCard(index, data.content.lackCard);
            break;
        case this.playCommand_playCard:
            this.handlePlayerPlarCard(index, data.content.card);
            break;
    }
}
/**给玩家定缺*/
p,handlePlayerLackCard = function (index, lackCard) {
    if(index<4){
        this["lackCard"+index] = lackCard;

        if(this.lackCard0.length>0 && this.lackCard1.length>0 && this.lackCard2.length>0 && this.lackCard3.length>0){
            this.changeState(this.STATE_PLAYCARD);
        }
    }
}
/**玩家出牌*/
p.handlePlayerPlarCard = function (index, card) {
    var index = this["cards"+index].indexOf(card)
    if(index >= 0){
        this["cards"+index].splice(index, 1);
        if(index != 0) this.checkHu(0, card);
        if(index != 1) this.checkHu(1, card);
        if(index != 2) this.checkHu(2, card);
        if(index != 3) this.checkHu(3, card);
    }
    else{
        console.log("玩家"+index+"没有这个牌"+card+"， 出牌失败");
    }
}
/**
 * 在出牌之后 检查是否可以 碰/杠/胡
 * i:检查谁的牌牌 card:出的什么牌
 * */
p.checkHu = function (index,card) {
    var cards = this["cards"+index].concat([card]);
    cardUtil.getCardHu(cards, function (b) {
        if(b){

        }
        else{
            
        }
    })
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
