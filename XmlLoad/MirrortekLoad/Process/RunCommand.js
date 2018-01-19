/**
 * Created by xaipo on 1/15/2018.
 */
const nodeCmd = require('node-cmd');
var log=require('../Process/Log');
module.exports = {

    runCommand: function (command){

        nodeCmd.get(command, (err, data, stderr) => log.register(data));
    }
}