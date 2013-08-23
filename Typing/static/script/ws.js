/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-8-12
 * Time: 下午11:09
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {
    var ws = new WebSocket("ws://59.66.138.69:8000/ws/");
    var debugModule = require("/static/script/debug")

    ws.onopen = function() {
        ws.send("Hello, world, second");
    };
    ws.onmessage = function (evt) {
        debugModule.appendDebugMessage(evt.data, 'info');
    };
    ws.onclose = function(evt) {
        debugModule.appendDebugMessage('Server met some problem', 'error');
    }
});