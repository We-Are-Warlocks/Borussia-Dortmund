/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-8-12
 * Time: 下午11:26
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {
    require('./lib/Events');    
    var input_token = require('./input_tokenn')
    var wsModule = require('./ws');

    if(document.addEventListener)
    {
        window.addEventListener('load',initFileItemClickHandler,false);
    }

    function initFileItemClickHandler(){
        var fileItemElements = document.getElementsByClassName('file-list-item');
        for(var i in fileItemElements){
            var item = fileItemElements[i];
            item.onclick = onFileItemClick;
        }
        function onFileItemClick(e){
            console.log(e.target.getAttribute("data-path"));
            wsModule.getFileContent(e.target.getAttribute("data-path"));
        }
    }

    var padObj = function tspeedPad(container, text) {
        var m_padObj = this;
        this.markers = [];
        this.currentSpan = undefined;
        this.listener = Events();
        var timeElapsed = 0;
        var _text = text;
        var _container = container;
        var _comparePad = document.getElementById("compare");
        var _currentCharIndex = 0;
        var _currentCharContainer = document.getElementById("currentChar");
        var typingElementArray = []
        var isAutoBracket = document.getElementById("bracket").checked;

        // 模拟构造函数
        function initContainer(){
            initTypingArea();
            //_container.innerHTML = _text;
            document.onkeypress = onKeyPress;
            document.onkeydown = onKeyDown;
            _currentCharContainer.innerHTML = _text[_currentCharIndex];
        }
        function initTypingArea(){
            var my_code_area_container = document.getElementById("my_code_area");
            var code_dom_tree = document.getElementById("code_area");
            var childs = code_dom_tree.childNodes;
            var isAfterComment = false;
            var newline = true;
            for (var child in childs){
                var childNode = childs[child];
                var text;
                if(childNode.classList && childNode.classList.contains('comment')){
                    var childNodeCopy = childNode.cloneNode(true);
                    isAfterComment = true;
                    my_code_area_container.appendChild(childNodeCopy);
                    continue;
                }
                if(childNode.innerHTML){
                    text = childNode.innerHTML;
                    isAfterComment = false;
                }
                else if(childNode.data){
                    text = childNode.data;
                }
                if(text && text.length > 0 && childNode.cloneNode){
                    for (var c in text){
                        var token = text[c];
                        var new_node;
                        if(childNode.innerHTML){
                            new_node = childNode.cloneNode(true);
                            new_node.innerHTML = token;
                        }
                        else if(childNode.data){
                            new_node = document.createElement("span");
                            new_node.innerHTML = token;
                        }
                        if(token === '\n' && !isAfterComment){
                            new_node.classList.add("invisible_enter");
                            newline = true;
                        }
                        else if(token === '\t' && !isAfterComment){
                            new_node.classList.add("invisible_tab");
                        }
                        else if(token === ' ' && newline){
                            new_node.classList.add("head_space");
                        }
                        else{
                            newline = false;
                        }
                        my_code_area_container.appendChild(new_node);
                        var token_obj = new input_token(token, new_node);
                        typingElementArray.push(token_obj);
                    }
                }
            }
            // split tokens to single elements
//            for (var token in _text){
//                var tokenElement = document.createElement("span");
//                tokenElement.innerHTML = _text[token];
//                var token_obj = new input_token(_text[token], tokenElement);
//                typingElementArray.push(token_obj);
//                _container.appendChild(tokenElement);
//            }
            var firstTokenElement = typingElementArray[0];
            firstTokenElement.setActive();
        }
        function processKeyCode(e){
            var char = String.fromCharCode(e.which);
            var timeGap = 0;
            var logStr = 'Char from Code: ' + char;
            if( timeElapsed === 0 ){
                timeElapsed = Date.now();
            }
            else{
                timeGap = Date.now() - timeElapsed;
                timeElapsed = Date.now();
                logStr += ' Time: ' + timeGap;
            }
            var my_speed_meter = document.getElementById("type_speed_meter");
            var rate = 100.0 * 40.0 / timeGap;
            my_speed_meter.style.height = rate + "%";
            //console.log(logStr);
            var currentTokenElement = typingElementArray[_currentCharIndex];
            currentTokenElement.input_tok(char);
            if( currentTokenElement.getStatus() === true && document.getElementById("bracket").checked && (char == '[' || char == '{' || char == '(')){
                // find the next bracket
                var consume = 0;
                for (var i = _currentCharIndex+1; i < typingElementArray.length; i++){
                    if(_text[i] === char){
                        consume ++;
                    }
                    else if(_text[i] === getBracketPair(char)){
                        consume --;
                    }
                    if(consume === -1){
                        typingElementArray[i].done();
                        break;
                    }
                }
            }
            while(currentTokenElement && currentTokenElement.getStatus() === true ){
                _currentCharIndex++;
                currentTokenElement = typingElementArray[_currentCharIndex];
            }
            var progressElement = document.getElementById('progress');
            progressElement.innerText = _currentCharIndex + ' / ' + typingElementArray.length;
            wsModule.sendUserProgress(_currentCharIndex + ' / ' + typingElementArray.length);
            if( _currentCharIndex == typingElementArray.length ){
                alert("Done!");
                return false;
            }
            typingElementArray[_currentCharIndex].setActive();
            m_padObj.currentSpan = typingElementArray[_currentCharIndex].getElement();
            m_padObj.listener.trigger('currentEleChange', m_padObj.currentSpan);
            return false;
        }
        function getBracketPair(char){
            switch (char) {
                case '[':
                    return ']';
                case '{':
                    return '}';
                case '(':
                    return ')';
                case '}':
                    return '{';
                case ']':
                    return '[';
                case ')':
                    return '(';
            }
        }
        function processBracketPair(){

        }
        function processControlCode(e) {

            var keycode = e.keyCode;

            if ( keycode == 8 ) {
                // backspace
                console.log('control: back space');
            }
            else if ( keycode == 13) {
                // enter
                console.log('control: enter');
            }
            else {
                return false;
            }
            return true;
        }
        function onKeyDown(e) {
            if (e.keyCode == 8) {
                return false;
            }
            return true;
        }
        function onKeyPress(e) {
            document.getElementById("keyUpCode").innerHTML = e.which;
            if (processControlCode(e)) {
                return false;
            }
            else {
                processKeyCode(e);
            }
            return false;
        }
        initContainer()
    };

    padObj.prototype.addMarker = function(){
        var marker_id = 0;
        return marker_id;
    };

    padObj.prototype.addlistener = function(key, fn){
        this.listener.listen(key, fn);
    }

    window['tspeedpad'] = padObj;
});