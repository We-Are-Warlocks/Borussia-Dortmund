/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-8-26
 * Time: 下午11:05
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {
    function Rule(regex,action) {
        // Each rule is re-written to match prefixes of the input string.
        this.regex = new RegExp("^(" + regex.source + ")") ;
        if (this.regex.compile) this.regex.compile(this.regex) ;
        this.action = action ;        
    }
    Rule.prototype.matches = function(s){
        var m = s.match(this.regex);
        if(m){
            m.shift();
        }
        return m;
    }

    function RunMethod(input) {
        var longestMatchedRule = null ;
        var longestMatch = null ;
        var longestMatchedLength = -1 ;

        for (var i = this.rules.length-1; i >= 0; --i) {
            var r = this.rules[i] ;

            var m = r.matches (input) ;

            if (m && (m[0].length >= longestMatchedLength)) {
                longestMatchedRule = r ;
                longestMatch = m ;
                longestMatchedLength = m[0].length ;
            }
        }

        if (longestMatchedRule) {
            return longestMatchedRule.action(longestMatch,input.substring(longestMatchedLength),this);
        } else {
            throw ("Lexing error; no match found for: '" + input + "'");
        }
    }

    function State() {
        var that = this;
        var rules = [];
        var state = function(regex){
            return function(action){
                rules.push(new Rule(regex,action) )
            }
        }
        state.rules = rules;
        state.run = RunMethod;
        state.continuation = function (input) {
            return function () {
                return state.run(input) ;
            } ;
        }
        state.lex = function(input) {
            var nextCont = state.run(input);
            while (typeof nextCont == "function") {
                nextCont = nextCont.call() ;
            }
            return nextCont;
        }
        return state;
    }
    exports.LexContinue = function Continue(state) {
        return function (rest) {
            return state.run(rest) ;
        }
    }
    var Lexer = {
        State : State
    }
    exports.Lexer = Lexer;
});

