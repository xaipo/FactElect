/**
 * Created by xaipo on 1/18/2018.
 */
var impuesto = require('./Impuestos');
var tarifa = require('./TarifaIva');
function Impuesto() {
    this.codigo = {value:impuesto.iva,tag:'codigo'};
    this.codigo_porcentaje = {value:tarifa.doce,tag:'codigoPorcentaje'};
    this.tarifa = {value:tarifa.doce,tag:'tarifa'};
    this.base_imponible = {value:'',tag:'baseImponible'};
    this.valor = {value:'',tag:'valor'};


}



module.exports = Impuesto;