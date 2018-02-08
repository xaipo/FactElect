/**
 * Created by xaipo on 1/15/2018.
 */

module.exports = {

    getNow: function (){
        var d = new Date();
        month=parseInt(d.getMonth())+1;
      //  console.log(d.getDay());
        return(d.getDate()+'-'+month+'-'+d.getFullYear()+'_'+d.getHours()+"-"+d.getMinutes()+'-'+d.getSeconds()+'-'+d.getMilliseconds());
    }
}