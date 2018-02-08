var tipoComprobante= require('./TiposComprobante');
var info_tributaria= require('./InformacionTributaria');
var tipo_comprabante= require('./TiposComprobante');
var id_proveedor= require('./IDProveedores');
var impuestos= require('./Impuestos');
var porcentajeImpuesto= require('./Impuestos');

function InfoTributaria() {
    this.id_documento='';
    this.razon_social = info_tributaria.razonSocial;
    this.nombre_comercial = info_tributaria.razonSocial;
    this.ruc = info_tributaria.ruc;
    this.contribuyente_especial = 'num preguntar';
    this.obligado_llevar_contabilidad ='SI';
    this.direccion_matriz =info_tributaria.direccion_matriz;
    this.direccion_establecimiento = info_tributaria.establecimientos[0].direccion;

    // this.clave_ccesso = {value:'', tag:'claveAcceso'};
    this.codigo_documento = tipoComprobante.factura;
    this.establecimiento = info_tributaria.establecimientos[0].codigo;
    this.punto_emision = info_tributaria.punto_emision;
    this.secuencial = '';
    
    this.fecha_emision = '';
    
   
    this.tipo_identifiacion_comprador = id_proveedor.venta_consumidor_final;
    this.razon_social_comprador = '';
    this.identificacion_comprador = '9999999999999';
    this.direccion_comprador='GUAYAQUIL';
    this.total_sin_impuestos='';
    this.total_descuento='';
    this.propina='0.00'

   // this.total_con_impuestos.value.push(impuesto);
    
    this.importe_total=0;
    this.moneda='Dolar';
    this.estado='0';
    this.pagos=[];
   // this.pagos.value.push(pago)
   ;
    this.detalles=[];
    //this.detalles.value.push(detalle)
    
    this.info_adicional=[];
    //this.info_adicional.value.push(adicional);
}



module.exports = InfoTributaria;