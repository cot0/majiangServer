/**
 * 消息的基本格式
 *
 * {
 *      command: number,
 *      code: number,
 *      sequence: number,
 *      content: {}
 * }
 *
 *
 * 玩游戏的消息格式
 *
 * {
 *      command: PLAY_GAME,
 *      sequence: number,
 *      content: {
 *          name:"",
 *          roomIn:number,
 *          //操作类型 依次是 发牌 定缺 出牌 胡杠碰过 结算
 *          state: 0/1/2/3/4,
 *          //发出的牌
 *          addCards:[],
 *          //剩余的牌数
 *          leftCardsNum:number,
 *          //他人的牌数
 *          otherCardNum:number,
 *          //定缺
 *          lackCard:"wan"/"tiao"/"tong",
 *          //出牌,碰牌（告知当前该第index个玩家操作了）
 *          index:number,
 *          gangAble:false,
 *          huAble:false,
 *          pengAble:false,
 *          //玩家操作
 *          action: hu/gang/peng/guo/play,
 *          //玩家出牌的牌号
 *          card:number
 *      }
 *
 * }
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * */
