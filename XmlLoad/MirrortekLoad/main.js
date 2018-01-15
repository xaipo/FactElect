/**
 * Created by xaipo on 1/15/2018.
 */
var process = require('./Process/ExecuteProcess');
var CronJob = require('cron').CronJob;
var express = require('express');
var bodyParser= require('body-parser');
var cors = require('cors');



var job = new CronJob({
    cronTime: '* * * * * *',
    onTick: function () {

        console.log('ejecuta');
        //Crud.insert();


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
    res.send('Hello World!'+job.running );

});
app.get('/parar', function (req, res) {
    process.stopFunction(job);
    res.send('Hello World!'+job.running );

});
app.get('/iniciar', function (req, res) {
    process.startFunction(job);
    res.send('Hello World!'+job.running );

});
app.listen(3000);
console.log("servidor ejecutando en el puerto 3000");