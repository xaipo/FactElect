//noinspection JSAnnotator
/**
 * Created by xaipo on 1/2/2018.
 */


var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var deasync = require('deasync');
module.exports ={
     config :  {
        userName: 'source',
        password: 'flimportsa',
        server: '127.0.0.1',
        options: {
            database: 'TestFLIQB'
            //,port: 51491
            , port: 1433,
            rowCollectionOnRequestCompletion:true
        }
        //options: {encrypt: false, }
        // If you are on Microsoft Azure, you need this:
        // options: {encrypt: true, }
    },
    
    executeSql:function(sql){
        var resp;
        var result;
        connection = new Connection(this.config);
        connection.on('connect', function (err) {
            // If no error, then good to proceed.
            if (err) {
                console.log(err);
            }
            console.log("Connected");
            request = new Request(sql, function (err,rowCount,rows) {
                if (err) {
                    console.log(err);
                }else{
                   resp=rows;
                }
            });
           
         /*  request.on('requestCompleted', function (rows) { 
                console.log(rows);
            });*/
            //var result = [];
            /*request.on('requestCompleted', function (columns) {
               columns .forEach(function (column) {
                    if (column.value === null) {
                        console.log('NULL');
                    } else {
                        result.push(column)
                    }
                });
                callback(result);
               console.log(result);
                result = "";
            });*/
    
           /* request.on('done', function (rowCount, more) {
                console.log(rowCount + ' rows returned');
            });*/
            connection.execSql(request);
            
        });
        while(resp === undefined) {
            require('deasync').runLoopOnce();
          }
        return resp;  
    }

    
}