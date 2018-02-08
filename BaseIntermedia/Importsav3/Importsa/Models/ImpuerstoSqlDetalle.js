
var impuesto= require('./Impuestos');
var tarifa= require('./TarifaIva');
var porcentaje= require('./PorcentajeIva')
function ImpuestoDetalle() {

   

    this.id_documento='';
   // this.pagos.value.push(pago)
   ;
    this.id_dimpuesto='';
    //this.detalles.value.push(detalle)
    
    this.codigo=impuesto.iva;
    this.codigo_porcentaje=tarifa.doce;
    this.base_imponible='';
    this.tarifa=porcentaje.doce;
    this.valor='';
    this.id_detalle='';
    //this.info_adicional.value.push(adicional);
}



module.exports = ImpuestoDetalle;