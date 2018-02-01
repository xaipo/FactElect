/**
 * Created by xaipo on 1/22/2018.
 */
var app = angular.module("myApp", ['angularUtils.directives.dirPagination'])
var server='localhost';

function ApiUrl(){

    this.getStart=function(){
        return 'http://'+server+':3000/start';
    }
    this.getStop=function(){
        return 'http://'+server+':3000/stop';
    }
    this.getStatus=function(){
        return 'http://'+server+':3000/status';
    }
    this.getLog=function(){
        return 'http://'+server+':3000/log';
    }
    this.clearLog=function(){
        return 'http://'+server+':3000/clear';
    }
    this.runManual=function(){
        return 'http://'+server+':3000/runManual';
    }
}

app.factory("myProvider",function(){
    // console.log("factory function");
    return new ApiUrl();

});





