/**
 * Created by xaipo on 1/18/2018.
 */
var forma = require('./FormasPago');
var tarifa = require('./TarifaIva');
function Pago() {
    this.forma_pago = {value:forma.sin_utilizacion_financiero,tag:'formaPago'};
    this.total = {value:'1',tag:'total'};
    this.plazo = {value:'30',tag:'plazo'};
    this.unidad_tiempo = {value:'dias',tag:'unidadTiempo'};



}



module.exports = Pago;