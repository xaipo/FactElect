/**
 * Created by xaipo on 1/15/2018.
 */
var fs = require('fs');
var now = require('./datesFormater');
var deasync = require('deasync');
module.exports = {

    register: function (text) {
        fs.appendFile('systemLog', '\n' + text + '_' + now.getNow() + '$', function (err) {

            if (err) return console.log(err);
            console.log('successfully appended "' + text + '"');
        });
    },
    writeLast: function (text) {
        var done = false;
        fs.writeFile('last', text + '_' + now.getNow() + '$', function (err) {

            if (err) return console.log(err);
            console.log('successfully appended "' + text + '"');
            done = true;
        });

        require('deasync').loopWhile(function () { return !done });
    },
    readLast: function () {
        var ret = undefined;
        fs.readFile('last', function (err, data) {

            var aux = data.toString('utf8');
            var vec = aux.split('_')
            ret = vec[0];
            // return(vec[0]);
        });

        require('deasync').loopWhile(function () { return ret === undefined });
        /*
        while(ret === undefined) {
            require('deasync').runLoopOnce();
          }
        */
        return ret;

    }




}