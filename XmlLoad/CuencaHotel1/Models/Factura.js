/**
 * Created by xaipo on 1/17/2018.
 */
var tipoComprobante= require('./TiposComprobante');
var info_tributaria= require('./InformacionTributaria');
var tipo_comprabante= require('./TiposComprobante');
var id_proveedor= require('./IDProveedores');
var impuestos= require('./Impuestos');
var porcentajeImpuesto= require('./Impuestos');
function Factura() {
    this.ambiente = {value:'1',tag:'ambiente'};
    this.tipo_emision = {value:'1',tag:'tipoEmision'};
    this.razon_social = {value:info_tributaria.razonSocial, tag:'razonSocial'};
    this.ruc = {value:info_tributaria.ruc, tag:'ruc'};
    this.clave_ccesso = {value:'', tag:'claveAcceso'};
    this.codigo_documento = {value:tipoComprobante.factura, tag:'codDoc'};
    this.establecimeinto = {value:info_tributaria.establecimientos[0].codigo, tag:'estab'};
    this.punto_emision = {value:info_tributaria.punto_emision, tag:'ptoEmi'};
    this.secuencial = {value:'', tag:'secuencial'};
    this.dirMatriz = {value:info_tributaria.direccion_matriz, tag:'dirMatriz'};
    this.fecha_emision = {value:'', tag:'fechaEmision'};
    this.direccion_establecimiento = {value:info_tributaria.establecimientos[0].direccion, tag:'fechaEmision'};
    this.contribuyente_especial = {value:'num preguntar', tag:'contribuyenteEspecial'};
    this.tipo_identifiacion_comprador = {value:id_proveedor.venta_consumidor_final, tag:'tipoIdentificacionComprador'};
    this.razon_social_comprador = {value:'', tag:'razonSocialComprador'};
    this.identificacion_comprador = {value:'9999999999999', tag:'identificacionComprador'};
    this.direccion_comprador={value:'', tag:'direccionComprador'};
    this.total_sin_impuestos={value:'', tag:'totalSinImpuestos'};
    this.total_descuento={value:'', tag:'totalDescuento'};
    this.total_con_impuestos={value:[], tag:'totalConImpuestos'};
    this.propina={value:'0.00', tag:'propina'};
    this.importe_total={value:'', tag:'importeTotal'};
    this.moneda={value:'Dolar', tag:'moneda'};
    this.pagos={value:[], tag:'pagos'};
    this.detalles={value:[], tag:'detalles'};
    this.info_adicional={value:[], tag:'infoAdicional'};
}



module.exports = Factura;