/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-8-12
 * Time: 下午11:09
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {
    var ws = new WebSocket("ws://59.66.138.69:8000/ws/");
    var pad = g_pad;
    ws.onopen = function() {
        ws.send("Hello, world, second");
    };
    ws.onmessage = function (evt) {
        alert(evt.data);
        console.log(pad);
    };
});