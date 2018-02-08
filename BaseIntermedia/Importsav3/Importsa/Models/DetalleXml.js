/**
 * Created by xaipo on 1/18/2018.
 */
var impuesto = require('./ImpuestoXml');

function Detalle() {
    this.codigo_principal = {value:'',tag:'codigoPrincipal'};
    this.descripcion = {value:'',tag:'descripcion'};
    this.cantidad = {value:'',tag:'cantidad'};
    this.precio_unitario = {value:'',tag:'precioUnitario'};
    this.descuento = {value:'0.00',tag:'descuento'};
    this.precio_total_sin_impuesto = {value:'',tag:'precioTotalSinImpuesto'};
    this.impuestos = {value:[],tag:'impuestos'};


}



module.exports = Detalle;