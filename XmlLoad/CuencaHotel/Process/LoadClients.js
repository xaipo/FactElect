/**
 * Created by xaipo on 1/21/2018.
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
var Clients= require('../Models/Client');
var Big = require('big-js');
var HashMap = require('hashmap');
XLSX = require('xlsx');
module.exports = {

    loadClients : function (){
        log.register('Load diccionario clientes')
        var workbook = XLSX.readFile('ExcelFiles\\clientes.xls');
        var name_sheet = workbook.SheetNames[0];
        var sheet = workbook.Sheets[name_sheet];
      // console.log(var sheet['E1']);
        var vec=  XLSX.utils.sheet_to_json(sheet);
        var n=vec.length;
        var clientes= new HashMap();
        var client= new Clients();
        clientes.set('first', 'test');
      //  console.log(clientes.get('first'));
        for(var i=0;i<n;i++){
            client= new Clients();
          //  console.log(vec[i]);
            if(vec[i].DIRECCION){
                client.direccion=  JSON.stringify(vec[i].DIRECCION).replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
            }
            if(vec[i].TELEFONOS){
                client.telefono=  vec[i].TELEFONOS.trim();
            }
            if(vec[i]['E MAIL']){
                client.mail= vec[i]['E MAIL'].trim();
            }
            var ruc;
            if(vec[i].RUC){
                ruc=  vec[i].RUC.trim();
            }
            clientes.set(ruc, client);
        }
    //    console.log(clientes);
        return clientes;
    }



}