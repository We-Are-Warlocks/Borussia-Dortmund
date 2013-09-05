/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-8-27
 * Time: 下午8:47
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {
    var Lexer = require('./lexer').Lexer;    
    var CONTINUE = require('./lexer').LexContinue;
    var HighlighterModule = require('./highlighter');
    var Highlighter = HighlighterModule.Highlighter;
    var EscapeHtml = HighlighterModule.EscapeHtml;
    /* Lexical analysis states. */    
    var JAVASCRIPT         = new Lexer.State() ;
    var JAVASCRIPT_1STRING = new Lexer.State() ;
    var JAVASCRIPT_2STRING = new Lexer.State() ;
    var JAVASCRIPT_COMMENT = new Lexer.State() ;

    var JSHighlighter = new Highlighter(JAVASCRIPT) ;


    /* Standard JavaScript lexemes. */
    JAVASCRIPT (/function|return|var|if|for|in|while|do|break/)   (JSHighlighter.classify("jskeyword", null)) ;
    JAVASCRIPT (/continue|switch|case|true|false|null|prototype/) (JSHighlighter.classify("jskeyword", null)) ;

    JAVASCRIPT (/[-=<>&\|?\{\}\()\[\]:;,\.\+\*\/!%\\]/) (JSHighlighter.rewriteAndClassify(EscapeHtml,'jspunctuation', null)) ;

    JAVASCRIPT (/\'/)               (JSHighlighter.classify("jsstring",CONTINUE(JAVASCRIPT_1STRING))) ;
    JAVASCRIPT (/\"/)               (JSHighlighter.classify("jsstring",CONTINUE(JAVASCRIPT_2STRING))) ;

    JAVASCRIPT (/\/[*]/)            (JSHighlighter.rewriteAndClassify(JSHighlighter.whitespaceHardener,"jscomment",CONTINUE(JAVASCRIPT_COMMENT))) ;
    JAVASCRIPT (/\/\/[^\r\n]*/)     (JSHighlighter.classify("jscomment")) ;

    JAVASCRIPT (/[\n\r \t]+/)       (JSHighlighter.eta('hardenWhitespace')) ;
    JAVASCRIPT (/\d+([.]\d+)?/)     (JSHighlighter.classify("jsnumber")) ;
    JAVASCRIPT (/(\w|\d|_)+/)       (JSHighlighter.classify("jsidentifier")) ;

    JAVASCRIPT (/\/[*]([^*]|[*][^\/])*[*]\//)  (JSHighlighter.rewriteAndClassify(JSHighlighter.escapeAndHarden,"jscomment")) ;
    JAVASCRIPT (/\/(\\\/|[^\/\n])*\/[gim]*/)   (JSHighlighter.classify("jsregexp")) ;

    JAVASCRIPT (/$/) (JSHighlighter.stop) ;


    /* Comments. */
    JAVASCRIPT_COMMENT (/\s+/)   (JSHighlighter.eta('hardenWhitespace')) ;
    JAVASCRIPT_COMMENT (/[*]\//) (JSHighlighter.classify("jscomment",CONTINUE(JAVASCRIPT))) ;
    JAVASCRIPT_COMMENT (/./)     (JSHighlighter.classify("jscomment")) ;


    /* Single-quoted strings. */
    JAVASCRIPT_1STRING (/\\\'/)  (JSHighlighter.classify("jsstring")) ;
    JAVASCRIPT_1STRING (/\'/)    (JSHighlighter.classify("jsstring",CONTINUE(JAVASCRIPT))) ;
    JAVASCRIPT_1STRING (/.|\s/)  (JSHighlighter.classify("jsstring")) ;


    /* Doubly-quoted strings. */
    JAVASCRIPT_2STRING (/\\\"/)  (JSHighlighter.classify("jsstring")) ;
    JAVASCRIPT_2STRING (/\"/)    (JSHighlighter.classify("jsstring",CONTINUE(JAVASCRIPT))) ;
    JAVASCRIPT_2STRING (/.|\s/)  (JSHighlighter.classify("jsstring")) ;

    exports.JavaScriptHighlighter = JSHighlighter;
    window['JsHighlighter'] = JSHighlighter;
})
