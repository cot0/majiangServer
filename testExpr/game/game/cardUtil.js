/**来一组发好的108张牌 */
exports.getNewCards108 = function () {
    var arr = [];
    for(var i=0; i<108; i++){
        arr.push(i);
    }

    var newArr = [];
    while(arr.length > 0){
        var r = parseInt(Math.random()*arr.length);
        newArr.push(arr[r]);
        arr.splice(r,1);
    }
    return newArr;
}
/**是否可以杠 同步*/
exports.getCardGangAble = function (cards) {
    var dic = {};
    for(var i=0; i<cards.length; i++) {
        var value = getCardNum(cards[i]);
        if(!dic[value]){
            dic[value]=0;
        }
        dic[value] ++;
    }
    for(var value in dic){
        if(dic[value] == 4){
            return true;
        }
    }
    return false;
}
/**是否可以杠指定的牌 用于检测杠他人出的牌 同步*/
exports.getCardGangAbleByCard = function (cards, card) {
    var v = getCardNum(card);
    var num = 0;
    for(var i=0; i<cards.length; i++) {
        if(v == getCardNum(cards[i]) ){
            num ++ ;
        }
    }
    return num == 3;
}
/**是否可以碰指定的牌 用于检测是否可以碰他人出的牌 同步*/
exports.getCardPengAbleByCard = function (cards, card) {
    var v = getCardNum(card);
    var num = 0;
    for(var i=0; i<cards.length; i++) {
        if(v == getCardNum(cards[i]) ){
            num ++ ;
        }
    }
    return num >= 2;
}
/**
 * 是否可以胡牌 0表示未胡，返回大于0表示番数 同步
 * */
exports.getCardHuAble = function (cards) {
    var wan = [];
    var tiao = [];
    var tong = [];

    for(var i=0; i<cards.length; i++){
        var card = cards[i];

        var num = getCardNum(card);

        if(card < 36){
            wan.push(num);
        }
        else if(card < 72){
            tiao.push(num);
        }
        else{
            tong.push(num);
        }
    }

    if(wan.length>0 && tiao.length>0 && tong.length>0){
        //还未打缺
        return false;
    }

    return checkPair(cards);
}
/**测试胡牌 11122233355 13 14 15*/
// var testArr = [0,0,0,4,4,4,8,8,8,16,19, 50,55,57];
// console.log("是否胡牌 "+checkPair(testArr));
/**是否有对子 传入的数据是未计算成点数的牌下标*/
function checkPair(cards) {
    console.log("checkPair "+cards);
    //以点数做key，这个点数的牌的数量做value
    var values = {};
    for(var i=0; i<cards.length; i++){
        var value = getCardNum(cards[i]);
        if(!values[value]){
            values[value] = 0;
        }
        values[value] ++;
    }

    var havePair = false;
    var isHu = false;
    for(var key in values){
        if(values[key] >= 2){
            havePair = true;

            var caseValues = {};
            for(var caseKey in values){
                if(caseKey != key){
                    caseValues[caseKey] = values[caseKey];
                }
                else{
                    caseValues[caseKey] = values[caseKey]-2;
                }
            }
            isHu = checkValues(caseValues);
            console.log("检查 去掉一对"+key+"之后的队列是否胡牌" + isHu);

            //发现胡牌就return;
            if(isHu){
                return true;
            }
        }
    }

    if(!havePair){
        return false;
    }
    if(!isHu){
        return false;
    }
}
/**区分花色 key点数 value数量*/
function checkValues(values) {
    var wan = [];
    var tiao = [];
    var tong = [];

    var arr1, arr2;
    for(var value in values){
        var num = values[value];
        if(num>0){
            for(var i=0; i<num; i++){
                if(value<= 9) {
                    wan.push(value);
                }
                else if(value <= 18){
                    tiao.push(value%9);
                }
                else{
                    tong.push(value%9);
                }
            }
        }
    }

    arr1 = wan.length>0 ? wan : (tiao.length>0 ? tiao:tong);
    arr2 = wan.length>0 ? (tiao.length>0 ? tiao:tong) :  (tiao.length>0 ? tong:[]);
    console.log("arr1 ",arr1," arr2 ",arr2);

    if(arr2.length > 0){
        return checkOneFlower(arr1) && checkOneFlower(arr2);
    }
    else{
        return checkOneFlower(arr1);
    }
}
/**检查一种花色 是否满足 a*AAA + b*BCD + c*EEEE  返回布尔*/
function checkOneFlower(arr) {
    console.log("检查一种花色 ",arr);
    var arr2Dic = function (arr) {
        var dic = {};
        for(var i=0; i<arr.length; i++){
            var value = arr[i];
            if(!dic[value]){
                dic[value] = 0;
            }
            dic[value] ++;
        }
        return dic;
    }

    var dic2Arr = function (dic) {
        var arr = [];
        for(var value in dic){
            var num = dic[value];
            if(num > 0){
                for(var i=0; i<num; i++){
                    arr.push(parseInt(value));
                }
            }
        }
        return arr;
    }

    var removeAAA = function (array) {
        var dic = arr2Dic(array);
        for(var value in dic){
            var num = dic[value];
            if(num >= 3){
                dic[value] -= 3;
            }
        }

        console.log("去掉AAA 之后 "+dic2Arr(dic))

        return dic2Arr(dic);
    }
    var removeABC = function (array) {
        var haveABC = false;
        for(var i=1;i<=7; i++){
            if(array.indexOf(i)>-1 && array.indexOf(i+1)>-1 && array.indexOf(i+2)>-1){
                haveABC = true;
                array.splice(array.indexOf(i), 1);
                array.splice(array.indexOf(i+1), 1);
                array.splice(array.indexOf(i+2), 1);
                break;
            }
        }
        if(haveABC){
            return removeABC(array);
        }
        else{
            //没有ABC了
            return array;
        }
    }


    arr = removeAAA(arr);
    arr = removeABC(arr);
    console.log("去掉ABC之后 ",arr);
    if(arr.length == 0){
        return true;
    }
    else{
        return false;
    }
}
/**将牌的序列号转为牌的点数*/
function getCardNum(value) {
    return Math.floor(value/4+1);
}

/**
 * 定义一下牌的命名:
 * 从0到107 先后分别是万条同 1-9
 * 比如 0123一万 4567二万... 104 105 106 107 九筒
 * */
