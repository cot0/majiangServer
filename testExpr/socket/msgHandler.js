var commands = require("./commands");
var loginHandler = require("../game/login/loginHandler");
var gameHandler = require("../game/game/gameHandler");
var events = require('events');
var emitter = new events.EventEmitter();

addEvents();

function addEvents() {
    addEvent(commands.REGISTER, loginHandler);
    addEvent(commands.LOGIN, loginHandler);
    addEvent(commands.MATCH_PLAYER, gameHandler);
}
function addEvent(command, handler) {
    emitter.on(command, function (ws, data) {
        handler.handMsg(ws, data);
    })
}

exports.dispatch = function (command, ws, data) {
    emitter.emit(command, ws, data);
}

