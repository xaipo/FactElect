/**
 * Created by xaipo on 1/15/2018.
 */
var builder = require('xmlbuilder');
module.exports = {

    generateFactura: function (object){

        var xml = builder.create('root')
            .ele('xmlbuilder')
            .ele('repo', {'type': 'git'}, 'git://github.com/oozcitak/xmlbuilder-js.git')
            .end({ pretty: true});

      //  console.log(xml);
        return(xml);
    }
}
