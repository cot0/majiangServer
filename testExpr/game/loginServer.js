//连接DB
var businessDB = require("../db/businessDB");
var codes = require("./errorCode");

/**注册*/
exports.register = function (name,password,callback) {
    if(!name){
        callback(codes.NAME_ILLEGAL);
        return;
    }

    if(!password){
        callback(codes.PSW_ILLEGAL);
        return;
    }

    businessDB.queryNameExist(name, function (err, exist) {
        if(err){
            callback(codes.DB_ERROR);
        }
        else{
            //已经存在
            if(exist){
                callback(codes.NAME_EXIST);
            }
            //不存在 直接创建用户
            else{
                businessDB.createUser(name, password, function (err, result) {
                    if(err){
                        callback(codes.DB_ERROR);
                    }
                    else{
                        callback(null, result);
                    }
                })
            }
        }

    });
}

/**登录*/
exports.login = function (name, password, callback) {
    if(!name){
        callback(codes.NAME_ILLEGAL);
        return;
    }

    if(!password){
        callback(codes.PSW_ILLEGAL);
        return;
    }

    businessDB.queryUser(name, password, function (err, result) {
        if(err){
            callback(codes.DB_ERROR);
        }
        else{
            if(result.length > 0){
                callback(null, true);
            }
            else{
                callback(codes.NAME_OR_PSW_NOT_EXIST);
            }
        }
    })
}
