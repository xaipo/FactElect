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
var factura = require('./Process/ProcessFactura');
var clients = require('./Process/LoadClients');
var readAcces = require('./Process/AccessRead');
var sqls = require('./Models/Sqls');
var Factura = require('./Models/Factura');
var fs = require('fs');

XLSX = require('xlsx');

var xls;

var clientes;
var consin = 0;
var con = 0;
var job = new CronJob({
    cronTime: '* * * * * *',
    onTick: function () {
        //clientes = clients.loadClients();
        // var facturaProcessed=factura.processFactura(clientes);
        log.writeLast(16517);
        var last =log.readLast();
        var query =sqls.sqlRead(last);
        var facturas= readAcces.readSql(query);
        var facturaActual = new Factura();
        var n= facturas.length;
        for(var i=0; i<n;i++){

          facturaActual= factura.processFacturaAccess(facturas[i],facturaActual,i);

        }
        /*
        if (result != undefined) {
            console.log(result);
            con++;
        }
        */
        consin++;
        console.log(con);
        console.log(consin);
        //  console.log(facturaProcessed);
        // pipe from stream

        //genera xml



        var commnad = 'move ExcelFiles\\test.txt ProcessedFiles\\destino' + date.getNow() + '.txt'
        //console.log(commnad);
        moveFile.runCommand(commnad);
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
    var commnad = 'move ExcelFiles\\test.txt ProcessedFiles\\destino' + date.getNow() + '.txt'
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