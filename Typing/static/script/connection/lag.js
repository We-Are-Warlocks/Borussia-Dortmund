
define(function(require, exports, module) {

    var ws = require('./ws');
    require('/static/script/lib/Events');
    var lag = 0;
    var intervalNumber = undefined;
    var lagArray = {};
    var currentLag = 0;
    var lagElement = null;

    var event = Events();

    function sendLagMessage(){
        var pack = {}
        pack.type = 'lag';
        var timeStamp = new Date().getTime();
        pack.content = timeStamp;
        lagArray[timeStamp] = {};
        lagArray[timeStamp].ping = timeStamp;
        ws.send(JSON.stringify(pack));
    }

    function setupLagInterval(){
        // Create a element to represent the lag information
        if(document && document.createElement){
            lagElement = document.createElement('div');
            lagElement.classList.add('lag-value-container');
            lagElement.style.width = 'auto';
            lagElement.innerHTML = 'UnKnown ms';
            document.body.appendChild(lagElement);
            // send an websocket pack per 3 seconds
            intervalNumber = setInterval(sendLagMessage, 3000);
        }
        // add a callback when server respond
        ws.addMessageListner('lag', function(obj){
            var returnTimeStamp = new Date().getTime();
            var sendTimeStamp = obj.content;
            lagArray[sendTimeStamp].pong = returnTimeStamp;
            currentLag = returnTimeStamp;//(returnTimeStamp - sendTimeStamp)/2.0;
            lagElement.innerHTML = (currentLag).toString() + ' ms';
            event.trigger('lagUpdate', currentLag);
        });
    }

    setupLagInterval();
    exports.event = event;
});