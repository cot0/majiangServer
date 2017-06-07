var db = require("./db");

exports.createUser = function (name, password, callback) {
    db.insertData("users", {name:name, password:password, balance:10000}, function (err, result) {
        if(err){
            callback(err);
        }
        else{
            callback(null, true);
        }
    });
}
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
exports.queryUserByNamePassword = function (name, password, callback) {
    return db.searchData("users", {name:name, password:password}, callback);
}

//批量查询用户
exports.queryUsersByNames = function (names, callback) {
    if(names.length > 0){
        db.searchData("users", {name: {$in:names}}, function (err, result) {
            if(err){
                callback(err);
            }
            else{
                callback(null, result);
            }
        });
    }
}


