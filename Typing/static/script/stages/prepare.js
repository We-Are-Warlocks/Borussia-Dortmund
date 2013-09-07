define(function(require, exports, module) {
	var users = [];
    var _container = undefined;
    var _userlistElement = undefined;

    var ws = require('/static/script/connection/ws');

	exports.userCome = _userCome;
    function _userCome(user){
		users.push(user);
        var userName = user;
        var liElement = document.createElement('div');
        liElement.innerHTML = userName;
        liElement.style.width = '100%';
        liElement.setAttribute('data-username', userName);
        _userlistElement.appendChild(liElement);
	}
    exports.userMessage = function(message){
        

    }

    exports.updateUserlist = update;
    function update(userlist){
        _userlistElement.innerHTML = "";
        users = [];
        for(var i in userlist){
            _userCome(userlist[i]);
        }
    }

    exports.userLeave = function(userName){
        for(var i in users){
            var user = users[i];
        }
    };

    exports.init = function(container){
        initContainer(container);
    };

    function initContainer(container){
        _container = container;
        _userlistElement = document.createElement('div');
        _userlistElement.style.position = 'absolute';
        _userlistElement.style.left = '250px';
        _userlistElement.style.right = '0px';
        _userlistElement.id = 'prepare-user-list';
        container.appendChild(_userlistElement);
        ws.addMessageListner('server-message', function(obj){
            if(obj.subtype == 'user-status-update'){
                var userlist = obj.content;
                update(userlist);
            }
        });
    }
});