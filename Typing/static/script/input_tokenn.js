/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-8-8
 * Time: 下午9:18
 * To change this template use File | Settings | File Templates.
 */

define(function(require, exports, module) {
    var input_token = function(token, span) {
        this._token = token;
        this._isDone = false;
        this._span = span;
        this._span.classList.add("undone_token");
    }

    input_token.prototype.getElement = function(){
        return this._span;
    }

    input_token.prototype.getToken = function(){
        return this._token;
    }

    input_token.prototype.getStatus = function(){
        if(this._token == '\n' || this._span.classList.contains("head_space")){
            this.done();
        }
        return this._isDone;
    }

    input_token.prototype.setActive = function(){
        this._span.classList.add("active_token");
    }

    input_token.prototype.done = function(){
        this._span.classList.add("done_token");
        this._span.classList.remove("active_token");
        this._span.classList.remove("incorrect_token");
        this._span.classList.remove("undone_token");
        this._isDone = true;
    }

    input_token.prototype.input_tok = function(token){
        this._span.classList.remove("active_token");
        if( token == this._token) {
            this._isDone = true;
            this._span.classList.add("done_token");
            this._span.classList.remove("incorrect_token");
            this._span.classList.remove("undone_token");
        }
        else {
            this._span.classList.add("incorrect_token");
            this._span.classList.remove("done_token");
        }
    }

    input_token.prototype.rev = function(){
        this._isDone = false;
        this._span.classList.remove("done_token");
        this._span.classList.remove("incorrect_token");
    }

    module.exports = input_token;
});


