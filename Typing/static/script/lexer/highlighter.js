/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-8-27
 * Time: 下午8:30
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {

    function Highlighter(initstate){
        this.initState = initstate;
    }

    Highlighter.prototype.stop = function(match, rest, state){
        return null
    }

    Highlighter.prototype.tabSpaces = 4;

    Highlighter.prototype.tabSpace = function () {
        var tabSpace = "" ;
        for (var i = 0; i < this.tabSpaces; ++i)
            tabSpace += "&nbsp;" ;
        return tabSpace;
    };

    Highlighter.prototype.hardenWhitespace = function (match,rest,state) {
        this.append(this.whitespaceHardener(match[0])) ;
        return state.continuation(rest) ;
    } ;

    Highlighter.prototype.whitespaceHardener = function (s) {
        s = s.replace(/ /g,"&nbsp;");
        s = s.replace(/\n/g,"<br />");
        s = s.replace(/\t/g,this.tabSpace()) ;
        return s ;
    } ;

    Highlighter.prototype.escapeAndHarden = function (s) {
        s = EscapeHtml(s) ;
        return this.whitespaceHardener(s) ;
    };

    Highlighter.prototype.escapeHTML = function (match,rest,state) {
        this.append(EscapeHtml(match[0])) ;
        return state.continuation(rest) ;
    } ;

    Highlighter.prototype.style = function(style,cc) {
        var that = this ;
        return function (match,rest,state) {
            that.append('<span style="'+style+'">'+EscapeHtml(match[0])+'</span>') ;
            return cc ? cc(rest) : state.continuation(rest) ;
        } ;
    } ;

    Highlighter.prototype.classify = function(className,cc) {
        var that = this ;
        return function (match,rest,state) {
            that.append('<span class="'+className+'">'+EscapeHtml(match[0])+'</span>') ;
            return cc ? cc(rest) : state.continuation(rest) ;
        } ;
    } ;

    Highlighter.prototype.rewrite = function(f,cc) {
        var that = this ;
        return function (match,rest,state) {
            that.append(f.call(that,match[0])) ;
            return cc ? cc(rest) : state.continuation(rest) ;
        } ;
    } ;

    Highlighter.prototype.rewriteAndClassify = function(f,className,cc) {
        var that = this ;
        return function (match,rest,state) {
            var result = f.call(that,match[0]);
            that.append('<span class="'+className+'">'+result+'</span>') ;
            return cc ? cc(rest) : state.continuation(rest) ;
        } ;
    } ;

    Highlighter.prototype.normal = function (match,rest,state) {
        this.append(EscapeHtml(match[0])) ;
        return state.continuation(rest) ;
    } ;

    Highlighter.prototype.eta = function (methodName) {
        var that = this ;
        return function () {
            return (that[methodName]).apply(that,arguments) ;
        } ;
    } ;

    function EscapeHtml(text){
        var s = text ;
        s = s.replace(/&/g,"&amp;") ;
        s = s.replace(/</g,"&lt;") ;
        s = s.replace(/>/g,"&gt;") ;
        return s ;
    }

    Highlighter.prototype.highlight = function (element,input) {
        var buffer = "" ;
        if (typeof element == "string") {
            element = document.getElementById( element ) ;
        }
        if (!input) {
            input = element.innerHTML ;
            var parts = input.match(/^\n*((.|\r|\n)*)\s*$/) ;
            input = parts[1] ;
        }
        this.append = function (html) {
            buffer += html ;
        };
        this.initState.lex(input);
        element.innerHTML = buffer;
		var symbolTypeDisplayer = document.getElementById('tokenTypeDisplayer');
		var children = element.getElementsByTagName('span');
		for( var i in children){
			if(children[i].addEventListener){
				children[i].addEventListener('mouseover', function(e){
					symbolTypeDisplayer.innerText = this.className;
				});
			}
		}
    } ;

    exports.Highlighter = Highlighter;
    exports.EscapeHtml = EscapeHtml;
});