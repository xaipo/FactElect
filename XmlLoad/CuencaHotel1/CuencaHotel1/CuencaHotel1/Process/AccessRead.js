/**
 * Created by xaipo on 1/15/2018.
 */
const ADODB = require('node-adodb');
const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=./db/melatte41.mdb;');
var deasync = require('deasync');
module.exports = {

    readSql: function (query,callback){

        var resp;

        connection.query(query).then(function (data) {
                var x = 10;
                resp=data;
            });

        while(resp === undefined) {
            require('deasync').runLoopOnce();
        }
        return resp;
    }

}