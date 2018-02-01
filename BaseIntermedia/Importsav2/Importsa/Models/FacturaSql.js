var tipoComprobante= require('./TiposComprobante');
var info_tributaria= require('./InformacionTributaria');
var tipo_comprabante= require('./TiposComprobante');
var id_proveedor= require('./IDProveedores');
var impuestos= require('./Impuestos');
var porcentajeImpuesto= require('./Impuestos');
var InfoTributaria = require('./InfoTributariaSql');
var ImpuestoGlobal= require('./ImpuestoGlobalSql');
function Factura() {

    this.informacion = new InfoTributaria();

    this.impuestos=new ImpuestoGlobal();
    this.pagos=[];
   // this.pagos.value.push(pago)
   ;
    this.detalles=[];
    //this.detalles.value.push(detalle)
    
    this.info_adicional=[];
    //this.info_adicional.value.push(adicional);
}



module.exports = Factura;