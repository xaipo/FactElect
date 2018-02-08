
var impuesto= require('./Impuestos');
var tarifa= require('./TarifaIva');
var porcentaje= require('./PorcentajeIva')
function ImpuestoGlobal() {

   

    this.id_documento='';
   // this.pagos.value.push(pago)
   ;
    this.id_impuesto='';
    //this.detalles.value.push(detalle)
    
    this.codigo=impuesto.iva;
    this.codigo_porcentaje=tarifa.doce;
    this.descuento_adicional='';
    this.base_imponible='';
    this.tarifa=porcentaje.doce;
    this.valor='';
    //this.info_adicional.value.push(adicional);
}



module.exports = ImpuestoGlobal;