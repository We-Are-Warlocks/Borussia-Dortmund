/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-8-23
 * Time: 下午8:34
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {

    if(document.addEventListener)
    {
        window.addEventListener('load',initContainer,false);
    }

    var _container;
    var _textContainerWrapper;
    var _textContainer;
    var _buffer = [];//防止一开始调用的时候出现undefined的问题

    function initContainer(){
        _container = document.createElement('div');
        _container.id = 'Console-container';
        _container.addEventListener('mouseover', mouseover);
        _container.addEventListener('mouseout', mouseout);
        _textContainerWrapper = document.createElement('div');
        _textContainerWrapper.id = 'Console-text-Wrapper';
        _container.appendChild(_textContainerWrapper);
        _textContainer = document.createElement('div');
        _textContainer.id = 'Console-text-container';
        _textContainerWrapper.appendChild(_textContainer);
        document.body.appendChild(_container)
        for(var b in _buffer){
            exports.appendDebugMessage(_buffer[b].message, _buffer[b].level);
        }
    }

    function mouseover(){
        //console.log('debug-mouse-over');
        _container.style.top = 0;
    }

    function mouseout(){
        //console.log('debug-mouse-out');
        _container.style.top = '-230px';
    }

    function addMessage(text, className){
        var para = document.createElement("div");
        para.classList.add(className)
        para.innerHTML = text;
        _textContainer.appendChild(para)
    }

    exports.appendDebugMessage = function(message, level){
        var className = 'Console-'
        className += level
        if(_textContainer){
            addMessage(message, className);
        }
        else{
            _buffer.push({'message':message, 'level':level});
        }
    }
});