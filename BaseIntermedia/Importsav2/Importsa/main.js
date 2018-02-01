/**
 * Created by xaipo on 1/15/2018.
 */

var CronJob = require('cron').CronJob;
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var process = require('./Process/ExecuteProcess');
var document = require('./Process/GenerateXml');
var log = require('./Process/Log');
var wtiteXml = require('./Process/SaveDocument');
var moveFile = require('./Process/RunCommand');
var date = require('./Process/datesFormater');
var facturaProcess = require('./Process/ProcessFactura');
var clients = require('./Process/LoadClients');
var Factura= require('./Models/FacturaSql');
var DataBase = require('./Process/CrudDataBase');
var Sqls = require('./Models/Sqls');
var fs = require('fs');
var deasync = require('deasync');
XLSX = require('xlsx');

var xls;

var clientes;

var job = new CronJob({
    // cronTime: ' 00 00 15 * * 1-5',//deploy ejecuta cada dia 5am
    // cronTime: ' 00 04 15 * * 1-5',//ejecuta cada dia 5am
    cronTime: '* * * * * *',//ejecuta siempre
    onTick: function () {

        //var facturaProcessed=factura.processFactura(clientes);

        //console.log(clientes.get())
        //  console.log(facturaProcessed);
        // pipe from stream

        //genera xml
        log.writeLast(1500);
        var lastProccessed=log.readLast();
        var sql = Sqls.sqlCountRows(lastProccessed);
        var rowsProcess=DataBase.executeSql(sql);
         rowsProcess=rowsProcess[0];
         rowsProcess=rowsProcess[0].value;
        while(rowsProcess>0){
            var sql2= Sqls.sqlTopRows(lastProccessed);
            var id=DataBase.executeSql(sql2);
            var id=id[0];
            var sqlGetFactura=Sqls.sqlRead(id[0].value);
            var facturaDB= DataBase.executeSql(sqlGetFactura);
            var n= facturaDB.length;
            var facturaActual= new Factura();
            
        
            for(var i=0; i<n;i++){
                
                facturaActual=facturaProcess.processFacturaSql(facturaDB[0],facturaActual,n,i);
                
            }
            
            
        }
      //  var commnad = 'move ExcelFiles\\facturas.xls ProcessedFiles\\destino' + date.getNow() + '.xls'
        //console.log(commnad);
       // moveFile.runCommand(commnad);
    },
    start: false,

});
process.startFunction(job);
console.log(job.running);




var path = require("path");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());// permite angular interactuar
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Routes">
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    log.register('estado proceso ' + job.running);
    //res.send('Hello World!'+job.running );
    res.sendFile(path.join(__dirname + '/public/index.html'));

});
app.post('/stop', function (req, res) {
    process.stopFunction(job);
    log.register('proceso parado ' + job.running);
    res.send(job.running);

});
app.post('/start', function (req, res) {
    process.startFunction(job);
    log.register('inicio proceso ' + job.running);
    res.send(job.running);

});
app.post('/status', function (req, res) {
    // process.startFunction(job);
    log.register('inicio proceso ' + job.running);
    res.send(job.running);

});
app.get('/log', function (req, res) {
    // process.startFunction(job);
    var file = fs.readFile('systemLog', function (err, data) {
        console.log(data.toString('utf8'));
        res.send(data.toString('utf8'));
    });


});

app.post('/runManual', function (req, res) {
    clientes = clients.loadClients();
    var facturaProcessed = factura.processFactura(clientes);
    var commnad = 'move ExcelFiles\\facturas.xls ProcessedFiles\\destino' + date.getNow() + '.xls'
    //console.log(commnad);
    moveFile.runCommand(commnad);
    res.send('ejecutado');
});


app.post('/clear', function (req, res) {
    var file = fs.writeFile('systemLog', 'clearlog_' + date.getNow() + '$', function (err, data) {
        // console.log(data.toString('utf8'));
        // res.send( data.toString('utf8'));
    });
    res.send('ejecutado');
});

app.listen(3000);
log.register("servidor ejecutando en el puerto 3000");
console.log("servidor ejecutando en el puerto 3000");