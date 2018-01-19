/**
 * Created by xaipo on 1/15/2018.
 */
var XMLWriter = require('xml-writer');
var fs = require('fs');
var now = require('./datesFormater');
module.exports = {

write: function (xml){

  path='./xmlResult/test'+now.getNow()+'.xml';
    fs.appendFile(path, xml, function (err) {
        if (err) throw err;
      //  console.log('Saved!');
    });
}

}