var db = require("./db");

exports.createUser = function (name, password, callback) {
    db.insertData("users", {name:name, password:password}, function (err, result) {
        if(err){
            callback(err);
        }
        else{
            callback(null, true);
        }
    });
}
/**用户名是否已存在*/
exports.queryNameExist = function(name, callback) {
    db.searchData("users", {name:name}, function (err, result) {
        if(err){
            callback(err);
        }
        else{
            if(result.length > 0){
                callback(null, true);
            }
            else{
                callback(null, false);
            }
        }
    });
}

exports.queryUser = function (name, password, callback) {
    return db.searchData("users", {name:name, password:password}, callback);
}
