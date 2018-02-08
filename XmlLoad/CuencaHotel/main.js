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
var writeXml = require('./Process/SaveDocument');
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

var job = new CronJob({
   // cronTime: '* * * * * *',
     cronTime: ' 00 04 15 * * 1-5',
    onTick: function () {
        //clientes = clients.loadClients();
        // var facturaProcessed=factura.processFactura(clientes);
        process_facturas();

        //  console.log(facturaProcessed);
        // pipe from stream

        //genera xml


        /*
        var commnad = 'move ExcelFiles\\test.txt ProcessedFiles\\destino' + date.getNow() + '.txt'
        //console.log(commnad);
        moveFile.runCommand(commnad);
        */
    },
    start: false,

});

var process_facturas = function () {
    console.log("entra");
    log.writeLast(15189);
    var last = log.readLast();
    var nextToProcess = readAcces.readSql(sqls.sqlGetNext(last));

    while (nextToProcess.length > 0) {
        var newId = nextToProcess[0].ordenId;
        process_single_factura(newId);
        console.log(newId);
        log.writeLast(newId);
        last = log.readLast();
        nextToProcess = readAcces.readSql(sqls.sqlGetNext(last));
    }

}

var process_single_factura = function (factura_id) {
    var query = sqls.sqlRead(factura_id);
    var facturas = readAcces.readSql(query);
    var facturaActual = new Factura();
    var n = facturas.length;
    if (n > 0) {
        var anulada = false;
        for (var i = 0; i < n; i++) {
            if(facturas[i].ordenNumeroFactura === null)
            {
                anulada = true;
                console.log('anulada');
                break;
            }

            facturaActual = factura.processFacturaAccess(facturas[i], facturaActual, i);
        }
        if (!anulada) {
            var xml = document.generateFactura(facturaActual);
            writeXml.write(xml, facturaActual.secuencial.value);
        }
    }
}


var path = require("path");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());// permite angular interactuar
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Routes">
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    //log.register('estado proceso ' + job.running);
    //res.send('Hello World!'+job.running );
    res.sendFile(path.join(__dirname + '/public/index.html'));

});
app.post('/stop', function (req, res) {
    process.stopFunction(job);
    //log.register('proceso parado ' + job.running);
    res.send(job.running);

});
app.post('/start', function (req, res) {
    process.startFunction(job);
    // log.register('inicio proceso ' + job.running);
    res.send(job.running);

});
app.post('/status', function (req, res) {
    // process.startFunction(job);
    // log.register('inicio proceso ' + job.running);
    res.send(job.running);

});
app.get('/log', function (req, res) {
    // process.startFunction(job);
    fs.readFile('systemLog', function (err, data) {
        console.log(data.toString('utf8'));
        res.send(data.toString('utf8'));
    });


});

app.post('/runManual', function (req, res) {
    /* clientes = clients.loadClients();
     var facturaProcessed = factura.processFactura(clientes);
     var commnad = 'move ExcelFiles\\test.txt ProcessedFiles\\destino' + date.getNow() + '.txt'
     //console.log(commnad);
     moveFile.runCommand(commnad);
     res.send('ejecutado');*/
});


app.post('/clear', function (req, res) {
    var file = fs.writeFile('systemLog', 'clearlog_' + date.getNow() + '$', function (err, data) {
        // console.log(data.toString('utf8'));
        // res.send( data.toString('utf8'));
    });
    res.send('ejecutado');
});

app.post('/setPropina', function (req, res) {
    log.writePropina(req.body.propina, function (text){
        res.send(text.toString());

    });

});

app.post('/getPropina', function (req, res) {
    var file = fs.readFile('PorcentajePropina', function (err, data) {
        console.log(data.toString('utf8'));
        res.send(data.toString('utf8'));
    });
    //res.send(text);
});

app.listen(3000);
log.register("servidor ejecutando en el puerto 3000");
console.log("servidor ejecutando en el puerto 3000");


process_facturas();


process.startFunction(job);
console.log(job.running);


