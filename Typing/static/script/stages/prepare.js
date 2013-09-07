define(function(require, exports, module) {

    var container = undefined;
    var userlistElement = undefined;

    var ws = require('/static/script/connection/ws');
    var lag = require('/static/script/connection/lag');
    var um = require('/static/script/tspeedPad/usermanager');
    var messagemap = {
        'init-userlist': function(list){
            for(var i in list){
                var u = list[i];
                um.update(u.name, u.status);
            }
        }
    }
    exports.init = function(container){
        initContainer(container);
    };

    function initContainer(c){
        container = c;
        userlistElement = document.createElement('div');
        userlistElement.id = 'prepare-user-list';
        container.appendChild(userlistElement);

        lag.event.listen('lagUpdate', function(lag){
            um.setme('lag', lag);
        });

        ws.addMessageListner('prepare', function(obj){
            var content = obj.content;
            messagemap[content.subtype](content.subcontent);
        });

        um.on('update', function(userlist){
            console.log(userlist);
        });
        um.on('me', function(me){
            var p = {};
            p.type = 'prepare';
            p.content = {
                subtype: 'update-me',
                subcontent: me
            };
            ws.send(JSON.stringify(p));
        });
    }
});