//存websocket的对象池
var WsPool = function () {
    var data = {};

    this.setValue = function (key, value) {
        data[key] = value
    }
    
    this.removeKey = function (key) {
        data[key] = null;
        delete data[key];
    }
    this.getValues = function () {
        var arr = [];
        for(var key in data){
            if(data[key]) arr.push(data[key]);
        }
        return arr;
    }
}

module.exports = WsPool;
