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
var identificaciones = require('../Models/IDProveedores');
XLSX = require('xlsx');
module.exports = {

    //llena la factura segun el formato para genera el xlm
    processFactura: function (){
        log.register('Lectura de Excel');
        var workbook = XLSX.readFile('ExcelFiles\\facturas.xls');
        var name_sheet = workbook.SheetNames[0];
        var sheet = workbook.Sheets[name_sheet];
        //  console.log(sheet);
        //console.log(sheet.A1);
        var vec=  XLSX.utils.sheet_to_json(sheet);
       // console.log(vec[0]);
       // console.log(vec[1]);

        var factura= new Factura();
       // console.log(factura);
        var n=vec.length;
        var count=0;
        var repetido=0;
        var lastNumber=0;
        for(var i=0;i<n;i++){
           //  vec[i]=JSON.parse(vec[i]);

            aux=vec[i+1];
            if(aux!== undefined) {


                if (vec[i].numfac === aux.numfac) {
                    repetido++;

                } else {
                    count++;
                    factura= new Factura();
                    var numAux= vec[i].numfac.split('-');
                    console.log(numAux);
                    factura.secuencial.value=numAux[1];
                    var dateAux=vec[i].fecfac.split(' ');
                    factura.fecha_emision.value=dateAux[0];
                    console.log(factura.fecha_emision);
                    lastNumber=vec[1].numfac;
                    //verificacion si es cedula o ruc para asignar el codigo
                    if(vec[i].codcli!=='9999999999999'){
                        vec[i].codcli=vec[i].codcli.trim();
                        var cantidad= vec[i].codcli.length;
                        console.log(vec[i].codcli);
                        console.log('cantidad'+cantidad);
                        switch (cantidad){

                            case 10: factura.tipo_identifiacion_comprador.value=identificaciones.cedula; break;
                            case 13: factura.tipo_identifiacion_comprador.value=identificaciones.ruc; break;
                            default: factura.tipo_identifiacion_comprador.value=identificaciones.pasaporte; break;
                        }
                    }
                    var nombre =  vec[i].nomcli.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                    console.log(nombre);
                    factura.razon_social_comprador.value=nombre;
                    factura.identificacion_comprador.value=vec[i].codcli;

                   // console.log(factura.tipo_identifiacion_comprador.value);
                    //pendiente la direccion del cliente
                    factura.total_sin_impuestos.value=vec[i].totnet;
                    factura.total_descuento.value=vec[i].totdes;
                    factura.total_con_impuestos.value=vec[i].totfac;
                    //falta importe total
                    //pagos
                    //detalle
                    //adicionales

                }




            }else{
                if(lastNumber===vec[i].numfac){
                        repetido++;
                }else{
                    count++;
                    factura= new Factura();
                    var numAux= vec[i].numfac.split('-');
                    console.log(numAux);
                    factura.secuencial=numAux[1];
                    console.log(factura.secuencial);
                    lastNumber=vec[1].numfac;
                }

            }

        }
       // console.log(count);
       // console.log(repetido);
        return(vec[0]);
    }

}