/**
 * Created by xaipo on 1/22/2018.
 */
var Big = require('big-js');
module.exports = {

    secuencial : function (num){

        var cant = num.length;

        switch (cant){

            case 1: return ('00000000'+num); break;
            case 2: return ('0000000'+num); break;
            case 3: return ('000000'+num); break;
            case 4: return ('00000'+num); break;
            case 5: return ('0000'+num); break;
            case 6: return ('000'+num); break;
            case 7: return ('00'+num); break;
            case 8: return ('0'+num); break;
            default: return (num);
        }
    },
    dateCero : function (num){

        var vec=num.split('-');
        var day =vec[1];
        var month =vec[0];
        var year =vec[2];

        var cant = day.length;
        if(cant==1){
            day='0'+day;
        }

        cant=month.length;
        if(cant==1){
            month='0'+month;
        }

        cant=year.length;
        if(cant==2){
            year='20'+year;
        }
        var result=day+'/'+month+'/'+year;
        return result;

    },
    fixedDecimal : function (num){

        var aux= new Big(num);
        var result=aux.toFixed(2).toString();
        return(result);
    }


}