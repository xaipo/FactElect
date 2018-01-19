/**
 * Created by xaipo on 1/15/2018.
 */
var fs = require('fs');
var now = require('./datesFormater');
module.exports = {

    register : function (text){
        fs.appendFile('systemLog', '\n'+text+'-'+ now.getNow(), function (err) {

            if (err) return console.log(err);
            console.log('successfully appended "' + text + '"');
        });
    }



}