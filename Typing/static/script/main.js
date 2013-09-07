/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-8-7
 * Time: 下午11:26
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    var debugModule = require("/static/script/debug")
    var wsModule = require("/static/script/connection/ws");
    var prepareModule = require("/static/script/stages/prepare");

    function init()
    {
        debugModule.appendDebugMessage('Go Go Go! --init-- ', 'info');
        wsModule.checkWebSocket();
    }

    if(document.addEventListener)
    {
        window.addEventListener('load',init,false);
        prepareModule.init(document.getElementById('prepare-userlist'));
    }
});