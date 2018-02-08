/**
 * Created by xaipo on 1/15/2018.
 */

var CronJob = require('cron').CronJob;
var express = require('express');
var bodyParser= require('body-parser');
var cors = require('cors');
var process = require('./Process/ExecuteProcess');
var document= require('./Process/GenerateXml');
var log=require('./Process/Log');
var wtiteXml=require('./Process/SaveDocument');
var moveFile=require('./Process/RunCommand');
var date=require('./Process/datesFormater');
var factura=require('./Process/ProcessFactura');
var clients=require('./Process/LoadClients');
var fs = require('fs');

XLSX = require('xlsx');

var xls;

var clientes;

var job = new CronJob({
   // cronTime: ' 00 00 15 * * 1-5',//deploy ejecuta cada dia 5am
    cronTime: ' 00 04 15 * * 1-5',//ejecuta cada dia 5am
   // cronTime: '* * * * * *',//ejecuta siempre
    onTick: function () {
        porceso();
    },
    start: false,

});
process.startFunction (job);
console.log(job.running);


var proceso = function (){
    clientes=clients.loadClients();
    var facturaProcessed=factura.processFactura(clientes);
    console.log('entra primera vez');
    //console.log(clientes.get())
    //  console.log(facturaProcessed);
// pipe from stream

    //genera xml


    var commnad='move ExcelFiles\\facturas.xls ProcessedFiles\\destino'+date.getNow()+'.xls'
    //console.log(commnad);
    moveFile.runCommand(commnad);
}

var path= require("path");
var app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());// permite angular interactuar
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Routes">
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    log.register('estado proceso '+ job.running);
    //res.send('Hello World!'+job.running );
    res.sendFile(path.join(__dirname+'/public/index.html'));

});
app.post('/stop', function (req, res) {
    process.stopFunction(job);
    log.register('proceso parado '+ job.running);
    res.send(job.running );

});
app.post('/start', function (req, res) {
    process.startFunction(job);
    log.register('inicio proceso '+ job.running);
    res.send(job.running );

});
app.post('/status', function (req, res) {
    // process.startFunction(job);
    log.register('inicio proceso '+ job.running);
    res.send(job.running);

});
app.get('/log', function (req, res) {
    // process.startFunction(job);
    var file=  fs.readFile('systemLog', function (err,data) {
        console.log(data.toString('utf8'));
        res.send( data.toString('utf8'));
    });


});

app.post('/runManual', function (req, res) {
    clientes=clients.loadClients();
    var facturaProcessed=factura.processFactura(clientes);
    var commnad='move ExcelFiles\\facturas.xls ProcessedFiles\\destino'+date.getNow()+'.xls'
    //console.log(commnad);
    moveFile.runCommand(commnad);
    res.send('ejecutado');
});


app.post('/clear', function (req, res) {
    var file=  fs.writeFile('systemLog','clearlog_'+date.getNow()+'$',function (err,data) {
       // console.log(data.toString('utf8'));
       // res.send( data.toString('utf8'));
    });
    res.send('ejecutado');
});
proceso();
app.listen(3000);
log.register("servidor ejecutando en el puerto 3000");
console.log("servidor ejecutando en el puerto 3000");