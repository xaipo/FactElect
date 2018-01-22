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
var Adicionales= require('../Models/AdicionalXml');
var Big = require('big-js');
XLSX = require('xlsx');
var HashMap = require('hashmap');
module.exports = {

    //llena la factura segun el formato para genera el xlm
    processFactura: function (clients){
        log.register('Lectura de Excel');
        var workbook = XLSX.readFile('ExcelFiles\\facturas.xls');
        var name_sheet = workbook.SheetNames[0];
        var sheet = workbook.Sheets[name_sheet];
     ;
        var vec=  XLSX.utils.sheet_to_json(sheet);
        var controlRepet=0;

        var factura= new Factura();

        var n=vec.length;
        var count=0;
        var repetido=0;
        var lastNumber=0;
        var facturas=[];
        var cont_factura_actual=0;
        for(var i=0;i<n;i++){


            aux=vec[i+1]
    /*        if(aux!== undefined) {*/

                if(i===0){
                    controlRepet=0;
                    controlRepet++;
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
                    var cli=clients.get(JSON.stringify(factura.identificacion_comprador.value));
                    if(cli!=undefined){
                        factura.direccion_comprador.value=cli.direccion;
                    }

                    //pendiente la direccion del cliente
                    factura.total_sin_impuestos.value=vec[i].totnet;
                    factura.total_descuento.value=vec[i].totdes;


                    /*agregar la parte de impuestos totales*/
                    var impuestoTotal= new  Impuesto();
                    // console.log(impuestoTotal);
                    impuestoTotal.base_imponible.value=factura.total_sin_impuestos.value;
                    impuestoTotal.valor.value=vec[i].totiva;
                    factura.total_con_impuestos.value.push(impuestoTotal);

                    var pagoFac= new Pago();
                    /*parte de pagos*/
                    if(vec[i].totfac>1000){
                        pagoFac.forma_pago.value=codigosFormas.otros_con_financiero;
                        pagoFac.plazo.value='45';
                    }

                    pagoFac.unidad_tiempo.value='dias';
                    factura.pagos.value.push(pagoFac);
                    var detalle = new Detalle();

                    detalle.codigo_principal.value=vec[i].codart.trim();
                    var desc= vec[i].nomart.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    detalle.descripcion.value=desc;
                    detalle.cantidad.value=vec[i].cantid;
                    detalle.precio_unitario.value=vec[i].preuni;
                    detalle.precio_total_sin_impuesto.value=vec[i].totren;

                    /*calculo impuesto del detalle*/

                    var ivaIndividual =  new Big(detalle.precio_total_sin_impuesto.value);
                    var impuestoIndividual= new Impuesto();
                    impuestoIndividual.base_imponible.value=vec[i].totren;
                    // impuestoIndividual.valor.value=ivaIndividual.multiply(porcentajeIva.doce);
                    ivaIndividual= ivaIndividual.times(porcentajeIva.doce).toFixed(2).toString();
                    //console.log(ivaIndividual+'big');
                    impuestoIndividual.valor.value=ivaIndividual;
                    detalle.impuestos.value[0]=impuestoIndividual;
                    factura.detalles.value.push(detalle);

                    var adicionales = new Adicionales();

                    if(cli!=undefined){
                        adicionales = new Adicionales();
                        adicionales.adicional.nombre='email'
                        adicionales.adicional.value=cli.mail;
                        factura.info_adicional.value.push(adicionales);
                        adicionales = new Adicionales();
                        adicionales.adicional.nombre='telefono'
                        adicionales.adicional.value=cli.telefono;
                        factura.info_adicional.value.push(adicionales);
                    }



                        facturas.push(factura);

                    cont_factura_actual=i;





                    //detalle
                    //adicionales
                    //     console.log(factura);
                }else{
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

                    var cli=clients.get(factura.identificacion_comprador.value);
                    if(cli!=undefined){
                        factura.direccion_comprador.value=cli.direccion;
                    }
                    factura.total_sin_impuestos.value=vec[i].totnet;
                    factura.total_descuento.value=vec[i].totdes;


                    /*agregar la parte de impuestos totales*/
                    var impuestoTotal= new  Impuesto();
                    // console.log(impuestoTotal);
                    impuestoTotal.base_imponible.value=factura.total_sin_impuestos.value;
                    impuestoTotal.valor.value=vec[i].totiva;
                    if(factura.secuencial.value===facturas[cont_factura_actual].secuencial.value) {
                        factura.total_con_impuestos=facturas[cont_factura_actual].total_con_impuestos;
                        factura.total_con_impuestos.value[0]=(impuestoTotal);
                    }else{
                        factura.total_con_impuestos.value.push(impuestoTotal);
                    }

                    var pagoFac= new Pago();
                    /*parte de pagos*/
                    if(vec[i].totfac>1000){
                        pagoFac.forma_pago.value=codigosFormas.otros_con_financiero;
                        pagoFac.plazo.value='45';
                    }

                    pagoFac.unidad_tiempo.value='dias';
                    if(factura.secuencial.value===facturas[cont_factura_actual].secuencial.value) {
                        factura.pagos=facturas[cont_factura_actual].pagos;
                        factura.pagos.value[0]=(pagoFac);
                    }else{
                        factura.pagos.value.push(pagoFac);
                    }
                    var newDetalle = new Detalle();
                    newDetalle.codigo_principal.value=vec[i].codart.trim();
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
                    if(factura.secuencial.value===facturas[cont_factura_actual].secuencial.value) {
                        factura.detalles=facturas[cont_factura_actual].detalles;
                        factura.detalles.value.push(newDetalle);
                    }else{
                        factura.detalles.value.push(newDetalle);
                    }

                    var adicionales = new Adicionales();



                    if(factura.secuencial.value===facturas[cont_factura_actual].secuencial.value){
                        facturas[cont_factura_actual]=factura;
                    }else{
                        if(cli!=undefined){
                            adicionales.adicional.nombre='email'
                            adicionales.adicional.value=cli.mail;
                            factura.info_adicional.value.push(adicionales);
                            adicionales = new Adicionales();
                            adicionales.adicional.nombre='telefono'
                            adicionales.adicional.value=cli.telefono;
                            factura.info_adicional.value.push(adicionales);
                        }
                        facturas.push(factura);
                        cont_factura_actual++;
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