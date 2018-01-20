/**
 * Created by xaipo on 1/17/2018.
 */
var process = require('./ExecuteProcess');
var document= require('./GenerateXml');
var log=require('./Log');
var wtiteXml=require('./SaveDocument');
var moveFile=require('./RunCommand');
var date=require('./datesFormater');
var Factura =require('../Models/Factura');
var Pago =require('../Models/PagoXml');
var identificaciones = require('../Models/IDProveedores');
var Impuesto = require('../Models/ImpuestoXml');
var codigosFormas= require('../Models/FormasPago');
var porcentajeIva= require('../Models/ValoresIva');
var Detalle= require('../Models/DetalleXml');
var Big = require('big-js');
XLSX = require('xlsx');
module.exports = {

    //llena la factura segun el formato para genera el xlm
    processFactura: function (){
        log.register('Lectura de Excel');
        var workbook = XLSX.readFile('ExcelFiles\\facturas.xls');
        var name_sheet = workbook.SheetNames[0];
        var sheet = workbook.Sheets[name_sheet];
     ;
        var vec=  XLSX.utils.sheet_to_json(sheet);


        var factura= new Factura();

        var n=vec.length;
        var count=0;
        var repetido=0;
        var lastNumber=0;
        var facturas=[];
        var cont_factura_actual=0;
        for(var i=0;i<n;i++){


            aux=vec[i+1];
            if(aux!== undefined) {


                if (vec[i].numfac === aux.numfac) {
                    repetido++;
                        // si la factura es la misma hay q sobre escribir a la posicion de facturas[cont_factura_actual]=factura procesada otra vez
                    factura= new Factura();
                    factura= facturas[cont_factura_actual];
                    var newDetalle = new Detalle();
                    newDetalle.codigo_principal=vec[i].codart.trim();
                    var desc= vec[i].nomart.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    newDetalle.descripcion.value=desc;
                    newDetalle.cantidad.value=vec[i].cantid;
                    newDetalle.precio_unitario.value=vec[i].preuni;
                    newDetalle.precio_total_sin_impuesto.value=vec[i].totren;

                    var ivaIndividual =  new Big(vec[i].totren);
                    var impuestoIndividual= new Impuesto();
                    impuestoIndividual.base_imponible.value=vec[i].totren;
                    // impuestoIndividual.valor.value=ivaIndividual.multiply(porcentajeIva.doce);
                    ivaIndividual= ivaIndividual.times(porcentajeIva.doce).toFixed(2).toString();
                    //console.log(ivaIndividual+'big');
                    impuestoIndividual.valor.value=ivaIndividual;
                    newDetalle.impuestos.value[0]=impuestoIndividual;

                    factura.detalles.value.push(newDetalle);

                    facturas.push(factura);

                } else {
                    count++;
                    factura= new Factura();
                    var numAux= vec[i].numfac.split('-');

                    factura.secuencial.value=numAux[1];
                    var dateAux=vec[i].fecfac.split(' ');
                    factura.fecha_emision.value=dateAux[0];

                    lastNumber=vec[1].numfac;
                    //verificacion si es cedula o ruc para asignar el codigo
                    if(vec[i].codcli!=='9999999999999'){
                        vec[i].codcli=vec[i].codcli.trim();
                        var cantidad= vec[i].codcli.length;

                        switch (cantidad){

                            case 10: factura.tipo_identifiacion_comprador.value=identificaciones.cedula; break;
                            case 13: factura.tipo_identifiacion_comprador.value=identificaciones.ruc; break;
                            default: factura.tipo_identifiacion_comprador.value=identificaciones.pasaporte; break;
                        }
                    }
                    var nombre =  vec[i].nomcli.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    factura.razon_social_comprador.value=nombre;
                    factura.identificacion_comprador.value=vec[i].codcli;

                    //pendiente la direccion del cliente
                    factura.total_sin_impuestos.value=vec[i].totnet;
                    factura.total_descuento.value=vec[i].totdes;


                    /*agregar la parte de impuestos totales*/
                    var impuestoTotal= new  Impuesto();
                   // console.log(impuestoTotal);
                    impuestoTotal.base_imponible.value=factura.total_sin_impuestos.value;
                    impuestoTotal.valor.value=vec[i].totiva;
                    factura.total_con_impuestos.value[0]=impuestoTotal;

                    var pagoFac= new Pago();
                    /*parte de pagos*/
                    if(vec[i].totfac>1000){
                        pagoFac.forma_pago.value=codigosFormas.otros_con_financiero;
                        pagoFac.plazo.value='45';
                    }

                    pagoFac.unidad_tiempo.value='dias';
                    factura.pagos.value[0]=pagoFac;


                    factura.detalles.value[0].codigo_principal.value=vec[i].codart.trim();
                    var desc= vec[i].nomart.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    factura.detalles.value[0].descripcion.value=desc;
                    factura.detalles.value[0].cantidad.value=vec[i].cantid;
                    factura.detalles.value[0].precio_unitario.value=vec[i].preuni;
                    factura.detalles.value[0].precio_total_sin_impuesto.value=vec[i].totren;

                    /*calculo impuesto del detalle*/

                    var ivaIndividual =  new Big(factura.detalles.value[0].precio_total_sin_impuesto.value);
                    var impuestoIndividual= new Impuesto();
                        impuestoIndividual.base_imponible.value=vec[i].totren;
                       // impuestoIndividual.valor.value=ivaIndividual.multiply(porcentajeIva.doce);
                    ivaIndividual= ivaIndividual.times(porcentajeIva.doce).toFixed(2).toString();
                    //console.log(ivaIndividual+'big');
                    impuestoIndividual.valor.value=ivaIndividual;
                    factura.detalles.value[0].impuestos.value[0]=impuestoIndividual;

                    facturas.push(factura);
                    cont_factura_actual=i;





                    //detalle
                    //adicionales
               //     console.log(factura);

                }




            }else{
                if(lastNumber===vec[i].numfac){
                    repetido++;
                    // si la factura es la misma hay q sobre escribir a la posicion de facturas[cont_factura_actual]=factura procesada otra vez
                    factura= new Factura();
                    factura= facturas[cont_factura_actual];
                    var newDetalle = new Detalle();
                    newDetalle.codigo_principal=vec[i].codart.trim();
                    var desc= vec[i].nomart.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    newDetalle.descripcion.value=desc;
                    newDetalle.cantidad.value=vec[i].cantid;
                    newDetalle.precio_unitario.value=vec[i].preuni;
                    newDetalle.precio_total_sin_impuesto.value=vec[i].totren;

                    var ivaIndividual =  new Big(vec[i].totren);
                    var impuestoIndividual= new Impuesto();
                    impuestoIndividual.base_imponible.value=vec[i].totren;
                    // impuestoIndividual.valor.value=ivaIndividual.multiply(porcentajeIva.doce);
                    ivaIndividual= ivaIndividual.times(porcentajeIva.doce).toFixed(2).toString();
                    //console.log(ivaIndividual+'big');
                    impuestoIndividual.valor.value=ivaIndividual;
                    newDetalle.impuestos.value[0]=impuestoIndividual;

                    factura.detalles.value.push(newDetalle);

                    facturas.push(factura);
                }else{
                    count++;
                    factura= new Factura();
                    var numAux= vec[i].numfac.split('-');

                    factura.secuencial.value=numAux[1];
                    var dateAux=vec[i].fecfac.split(' ');
                    factura.fecha_emision.value=dateAux[0];

                    lastNumber=vec[1].numfac;
                    //verificacion si es cedula o ruc para asignar el codigo
                    if(vec[i].codcli!=='9999999999999'){
                        vec[i].codcli=vec[i].codcli.trim();
                        var cantidad= vec[i].codcli.length;

                        switch (cantidad){

                            case 10: factura.tipo_identifiacion_comprador.value=identificaciones.cedula; break;
                            case 13: factura.tipo_identifiacion_comprador.value=identificaciones.ruc; break;
                            default: factura.tipo_identifiacion_comprador.value=identificaciones.pasaporte; break;
                        }
                    }
                    var nombre =  vec[i].nomcli.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    factura.razon_social_comprador.value=nombre;
                    factura.identificacion_comprador.value=vec[i].codcli;

                    //pendiente la direccion del cliente
                    factura.total_sin_impuestos.value=vec[i].totnet;
                    factura.total_descuento.value=vec[i].totdes;


                    /*agregar la parte de impuestos totales*/
                    var impuestoTotal= new  Impuesto();
                    // console.log(impuestoTotal);
                    impuestoTotal.base_imponible.value=factura.total_sin_impuestos.value;
                    impuestoTotal.valor.value=vec[i].totiva;
                    factura.total_con_impuestos.value[0]=impuestoTotal;

                    var pagoFac= new Pago();
                    /*parte de pagos*/
                    if(vec[i].totfac>1000){
                        pagoFac.forma_pago.value=codigosFormas.otros_con_financiero;
                        pagoFac.plazo.value='45';
                    }

                    pagoFac.unidad_tiempo.value='dias';
                    factura.pagos.value[0]=pagoFac;


                    factura.detalles.value[0].codigo_principal.value=vec[i].codart.trim();
                    var desc= vec[i].nomart.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    factura.detalles.value[0].descripcion.value=desc;
                    factura.detalles.value[0].cantidad.value=vec[i].cantid;
                    factura.detalles.value[0].precio_unitario.value=vec[i].preuni;
                    factura.detalles.value[0].precio_total_sin_impuesto.value=vec[i].totren;

                    /*calculo impuesto del detalle*/

                    var ivaIndividual =  new Big(factura.detalles.value[0].precio_total_sin_impuesto.value);
                    var impuestoIndividual= new Impuesto();
                    impuestoIndividual.base_imponible.value=vec[i].totren;
                    // impuestoIndividual.valor.value=ivaIndividual.multiply(porcentajeIva.doce);
                    ivaIndividual= ivaIndividual.times(porcentajeIva.doce).toFixed(2).toString();
                    //console.log(ivaIndividual+'big');
                    impuestoIndividual.valor.value=ivaIndividual;
                    factura.detalles.value[0].impuestos.value[0]=impuestoIndividual;

                    facturas.push(factura);
                    cont_factura_actual=i;
                }

            }

        }
        var m=facturas.length;
       //console.log(facturas);
        for(var i=0; i<m;i++){
            console.log(i);
           var xml= document.generateFactura(facturas[i]);
            wtiteXml.write(xml,facturas[i].secuencial.value);
        }

       // console.log(count);
       // console.log(repetido);
        return(vec[0]);
    }

}