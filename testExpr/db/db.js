
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/test';
    var _db;
    MongoClient.connect(url, function(err, db) {
        if(err){
            console.log("connect mongodb err "+err);
            return;
        }
        console.log('Connected correctly to mongodb server.');
        _db = db;
    });

    /**data json格式*/
    exports.insertData = function (col, data, callback) {
        var collection = _db.collection(col);
        collection.insert(data, function (err, result) {
            if(err){
                console.log("insert error: "+err);
                callback(err);
                return;
            }
            callback(null, result);
        })
    }

    /**whereStr: 查询条件 json格式 例如{name:"张三"}*/
    exports.searchData = function (col, whereStr, callback) {
        var collection = _db.collection(col);
        collection.find(whereStr).toArray(function (err, result) {
            if(err){
                console.log("search error "+err);
                callback(err);
                return;
            }
            callback(null, result);
            return true;
        });
    }

    /**
     * whereStr: 查询条件 json格式 例如{name:"张三"}
     * updateStr: 修改内容 json格式 例如{$set: {password:"aabbcc"}}
     * */
    exports.updateData = function (col, whereStr, updateStr, callback) {
        var collection = _db.collection(col);
        collection.update(whereStr, updateStr, function (err, result) {
            if(err){
                console.log("update error "+err);
                callback(err);
                return;
            }
            callback(null, result);
        })
    }

    /**remove指令返回的result有点大，包括collection对象*/
    exports.deleteData = function (col, whereStr, callback) {
        var collection = _db.collection(col);
        collection.remove(whereStr, function (err, result) {
            if(err){
                console.log("remove error "+err);
                callback(err);
                return;
            }
            callback(null, result);
        });
    }



