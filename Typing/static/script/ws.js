/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-8-12
 * Time: 下午11:09
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {
    var ws = new WebSocket("ws://localhost:8000/ws/");
    var debugModule = require("/static/script/debug")
    var lag = 0;
    var ping_timestamp = 0;

    //var base = require('./base')
    ws.onopen = function() {
        var pack = {}
        pack.type = 'incoming-user';
        pack.content = {};
        pack.content.pad = window['pad']
        pack.content.user = window['user']
        ws.send(JSON.stringify(pack));
    };
    ws.onmessage = function (evt) {
        //debugModule.appendDebugMessage(evt.data, 'info');
        console.log(evt);
        var obj = JSON.parse(evt.data);
        switch (obj.type){
            case 'response-file':
                handleRespondFile(obj);
                break;
            case 'server-message':
                handleServerMessage(obj);
                debugModule.appendDebugMessage(obj.content, 'info');
            case 'pad-message':
                handlePadMessage(obj);
                debugModule.appendDebugMessage('Pad:' + obj.content, 'info');
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
                var user_list_container = document.getElementById('user_list_container');
                if( user_list_container ){
                    var new_user = document.createElement('div');
                    new_user.setAttribute('data-username', obj.content);
                    new_user.innerText = obj.content;
                    user_list_container.appendChild(new_user);
                }
        }
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

    exports.getLag = function(){

    }

    exports.setLagPackInterval = function(interval){

    }

    function handleRespondFile(req){
        var content = req.content;
        console.log(content);
        //code_area
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