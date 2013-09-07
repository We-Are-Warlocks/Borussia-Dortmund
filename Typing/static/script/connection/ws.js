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
        var pack = {}
        pack.type = 'incoming-user';
        pack.content = {};
        pack.content.pad = window['pad']
        pack.content.user = window['user']
        ws.send(JSON.stringify(pack));

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
        switch (obj.type){
            case 'response-file':
                handleRespondFile(obj);
                break;
            case 'server-message':
                handleServerMessage(obj);
                debugModule.appendDebugMessage(obj.content, 'info');
                break;
            case 'pad-message':
                handlePadMessage(obj);
                debugModule.appendDebugMessage('Pad:' + obj.content, 'info');
                break;
        }
    };
    ws.onclose = function(evt) {
        debugModule.appendDebugMessage('Server met some problems', 'error');
    }

    function handlePadMessage(obj){
        switch(obj.subtype){
            case 'user-progress':
                var user_list_container = document.getElementById('user_list_container');
                if( user_list_container ){
                    for(var i in user_list_container.children){
                        var element = user_list_container.children[i];
                        var username = element.getAttribute('data-username')
                        if(username == obj.username ){
                            element.innerText = username + ':' + obj.content;
                        }
                    }
                }
        }
    }

    function handleServerMessage(obj){
        switch(obj.subtype){
            case 'user-arrive':
                //prepareModule.userCome(obj.content);
                var user_list_container = document.getElementById('user_list_container');
                if( user_list_container ){
                    var new_user = document.createElement('div');
                    new_user.setAttribute('data-username', obj.content);
                    new_user.innerText = obj.content;
                    user_list_container.appendChild(new_user);
                }
                break;
            case 'user-status-update':
                console.log(obj.content);
                //prepareModule.updateUserlist(obj.content);
        }
    }

    exports.send = function(content){
        ws.send(content);
    }

    exports.sendUserProgress = function(message){
        var pack = {};
        pack.type = 'pad-message';
        pack.subtype = 'user-progress';
        pack.username = window['user'];
        pack.content = message;
        ws.send(JSON.stringify(pack));
    }

    exports.getFileContent = function(path){
        var pack = {}
        pack.type = 'request-file';
        pack.content = path;
        ws.send(JSON.stringify(pack));
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

    function handleRespondFile(req){
        var content = req.content;
        var code_area_element = document.getElementById('code_area');
        var my_code_area_element = document.getElementById('my_code_area');
        my_code_area_element.innerHTML = '';
        code_area_element.innerHTML = content;
        Rainbow.color(document);
        var padContainer = document.getElementById("typingArea");
        g_pad = new tspeedpad(padContainer, "static{{[]}}_path[=os.path.join(os.path.dirname(__file__), \"static\")],");
        g_pad.addlistener('currentEleChange', function(element){
            console.log(element);
        });
    }
});