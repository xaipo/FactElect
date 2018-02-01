/**
 * Created by xaipo on 1/15/2018.
 */
var fs = require('fs');
var now = require('./datesFormater');
module.exports = {

    register : function (text){
        fs.appendFile('systemLog', '\n'+text+'_'+ now.getNow()+'$', function (err) {

            if (err) return console.log(err);
            console.log('successfully appended "' + text + '"');
        });
    },
    writeLast: function (text) {
        fs.writeFile('last',   text + '_' + now.getNow() + '$', function (err) {

            if (err) return console.log(err);
            console.log('successfully appended "' + text + '"');
        });
    },
    readLast: function () {
        var ret
        fs.readFile('last', function (err, data) {

            var aux = data.toString('utf8');
            var vec=aux.split('_')
            ret=vec[0];
            // return(vec[0]);

        });
        while(ret === undefined) {
            require('deasync').runLoopOnce();
        }
        return ret;

    }



}