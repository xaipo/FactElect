/**
 * Created by xaipo on 1/2/2018.
 */
var CronJob = require('cron').CronJob;
//var Crud= require('./CrudDataBase');
module.exports = {



    startFunction : function (job) {


        job.start();
    },

    stopFunction : function (job) {

        job.stop();
    }
}
