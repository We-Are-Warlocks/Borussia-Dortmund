/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-8-12
 * Time: 下午11:09
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {
    var address = 'localhost:8000';
    //var address = '59.66.138.69:8000'
    // open websocket
    var ws = new WebSocket("ws://"+address+"/ws/");
    var debugModule = require("/static/script/debug");
    var messageHandler = {};

    ws.onopen = function() {
        var initpack = {}
        initpack.type = 'ws-init';
        initpack.content = {};
        initpack.content.pad = window['pad'];
        initpack.content.user = window['user'];
        ws.send(JSON.stringify(initpack));
    };
    ws.onmessage = function (evt) {
        var obj = JSON.parse(evt.data);
        var messageType = obj.type;
        if(messageType in messageHandler){
            for(var i in messageHandler[messageType]){
                var fn = messageHandler[messageType][i];
                fn(obj);
            }
        }
    };
    ws.onclose = function(evt) {
        debugModule.appendDebugMessage('Server met some problems', 'error');
    }

    exports.send = function(content){
        ws.send(content);
    }

    exports.addMessageListner = function(key, fn){
        if(!(key in messageHandler)){
            messageHandler[key] = [];
        }
        messageHandler[key].push(fn);
    }

    exports.checkWebSocket = function(){
        if(ws){
            debugModule.appendDebugMessage('Websocket works well!', 'info');
        }
        else{
            debugModule.appendDebugMessage('Websocket doesn\'t work..', 'warning');
        }
    }
});