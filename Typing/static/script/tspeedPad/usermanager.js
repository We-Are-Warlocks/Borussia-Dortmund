/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-9-7
 * Time: 下午8:22
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {

    require('/static/script/lib/Events');
    var observer = Events();
    var me = {};
    var others = {};

    me.stage = 'prepare';

    var ws = require('/static/script/connection/ws');
    ws.addMessageListner('user-update', function(info){
        var c = info.content;
        exports.update(c.name, c.status);
    });

    exports.update = function(username, info){
        others[username] = info;
        observer.trigger('update', others);
    };

    exports.get = function(username){
        return others[username];
    }

    exports.me = function(){
        return me;
    }

    exports.on = function(key, fn){
        observer.listen(key, fn);
    }

    exports.setme = function(key, value){
        if(value){
            me[key] = value;
            observer.trigger('me', me);
        }
    }
});