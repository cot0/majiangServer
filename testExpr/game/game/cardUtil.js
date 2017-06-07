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

/**
 * 定义一下牌的命名:
 * 从0到107 先后分别是万条同 1-9
 * 比如 0123一万 4567二万... 104 105 106 107 九筒
 * */
