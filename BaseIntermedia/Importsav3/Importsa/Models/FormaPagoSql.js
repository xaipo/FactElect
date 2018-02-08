
var forma=require('./FormasPago');
function FormaPago() {

    this.id_documento = '';

    this.id_pago='';
   // this.pagos.value.push(pago)
   ;
    this.forma_pago=forma.sin_utilizacion_financiero;
    //this.detalles.value.push(detalle)
    
    this.total='';
    this.plazo='0';
    this.unidad_tiempo='dias';
    //this.info_adicional.value.push(adicional);
}



module.exports = FormaPago;