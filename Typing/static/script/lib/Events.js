/**
 * Created with JetBrains WebStorm.
 * User: Jin-yc10-PC
 * Date: 13-8-13
 * Time: 上午3:45
 * To change this template use File | Settings | File Templates.
 */
define(function(require, exports, module) {
    Events = function() {
        var listen, log, obj, one, remove, trigger, __this;
        obj = {};
        __this = this;
        listen = function( key, eventfn ) {
            var stack, _ref;  //stack是盒子
            stack = ( _ref = obj[key] ) != null ? _ref : obj[ key ] = [];
            return stack.push( eventfn );
        };
        one = function( key, eventfn ) {
            remove( key );
            return listen( key, eventfn );
        };
        remove = function( key ) {
            var _ref;
            return ( _ref = obj[key] ) != null ? _ref.length = 0 : void 0;
        };
        trigger = function() {
            var fn, stack, _i, _len, _ref, key;
            key = Array.prototype.shift.call( arguments );
            stack = ( _ref = obj[ key ] ) != null ? _ref : obj[ key ] = [];
            for ( _i = 0, _len = stack.length; _i < _len; _i++ ) {
                fn = stack[ _i ];
                if ( fn.apply( __this,  arguments ) === false) {
                    return false;
                }
            }
        }
        return {
            listen: listen,
            one: one,
            remove: remove,
            trigger: trigger
        }
    };
});