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
XLSX = require('xlsx');

var xls;

var job = new CronJob({
    cronTime: '* * * * * *',
    onTick: function () {

   var facturaProcessed=factura.processFactura();
      //  console.log(facturaProcessed);
// pipe from stream

        //genera xml
        var xml=document.generateFactura(xls);
        //guardar xml
        wtiteXml.write(xml);


        var commnad='move ExcelFiles\\test.txt ProcessedFiles\\destino'+date.getNow()+'.txt'
        //console.log(commnad);
        moveFile.runCommand(commnad);
    },
    start: false,

});
process.startFunction (job);
console.log(job.running);





var app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());// permite angular interactuar
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Routes">

app.get('/', function (req, res) {
    log.register('estado proceso '+ job.running);
    res.send('Hello World!'+job.running );

});
app.get('/parar', function (req, res) {
    process.stopFunction(job);
    log.register('proceso parado '+ job.running);
    res.send('Hello World!'+job.running );

});
app.get('/iniciar', function (req, res) {
    process.startFunction(job);
    log.register('inicio proceso '+ job.running);
    res.send('Hello World!'+job.running );

});
app.listen(3000);
log.register("servidor ejecutando en el puerto 3000");
console.log("servidor ejecutando en el puerto 3000");