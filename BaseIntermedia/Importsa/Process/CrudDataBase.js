//noinspection JSAnnotator
/**
 * Created by xaipo on 1/2/2018.
 */
/*
module.exports = {



    config:config = {
        userName: 'xaipo',
        password: 'xaipocoorp',
        server: 'localhost',
        // If you are on Microsoft Azure, you need this:
        options: {encrypt: true, database: 'testUploadExcel'}
    }
    ,
   // executeStatement:function(connection) {

//},
       insert: function(){
    Connection = require('tedious').Connection;
        var connection = new Connection(config);
         connection.on('connect', function(err) {
             var Request = require('tedious').Request;
             var  TYPES = require('tedious').TYPES;
            // If no error, then good to proceed.
            console.log("Connected");
            request = new Request("SELECT * from estudiante", function(err) {
                if (err) {
                    console.log(err);}
            });
            var result = "";
            request.on('row', function(columns) {
                columns.forEach(function(column) {
                    if (column.value === null) {
                        console.log('NULL');
                    } else {
                        result+= column.value + " ";
                    }
                });
                console.log(result);
                result ="";
            });

            request.on('done', function(rowCount, more) {
                console.log(rowCount + ' rows returned');
            });
            connection.execSql(request);
        });
    }
}

*/
var Connection = require('tedious').Connection;
var config = {
    userName: 'source',
    password: 'flimportsa',
    server: 'flimportsasvr.servep2p.com',
    options:{database: 'testUploadExcel'
        ,port: 51491
       // ,port: 1433
    }
    //options: {encrypt: false, }
    // If you are on Microsoft Azure, you need this:
   // options: {encrypt: true, }
};
var connection = new Connection(config);
connection.on('connect', function(err) {
    // If no error, then good to proceed.
    if (err) {
        console.log(err);}
    console.log("Connected");
    executeStatement();
});

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

function executeStatement() {
    request = new Request("SELECT * from estudiante ;", function(err) {
        if (err) {
            console.log(err);}
    });
    var result = "";
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result+= column.value + " ";
            }
        });
        console.log(result);
        result ="";
    });

    request.on('done', function(rowCount, more) {
        console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);
}