/**
 * Created by xaipo on 1/17/2018.
 */
var process = require('./ExecuteProcess');
var document = require('./GenerateXml');
var log = require('./Log');
var wtiteXml = require('./SaveDocument');
var moveFile = require('./RunCommand');
var date = require('./datesFormater');
var Factura = require('../Models/Factura');
var Pago = require('../Models/PagoXml');
var identificaciones = require('../Models/IDProveedores');
var Impuesto = require('../Models/ImpuestoXml');
var codigosFormas = require('../Models/FormasPago');
var porcentajeIva = require('../Models/ValoresIva');
var porcentaje = require('../Models/PorcentajeIva');
var Detalle = require('../Models/DetalleXml');
var Adicionales = require('../Models/AdicionalXml');
var Big = require('big-js');
XLSX = require('xlsx');
var HashMap = require('hashmap');
var Validate = require('./validateParameters');
var sqls = require('../Models/Sqls');
var DataBase = require('./CrudDataBase');
var PagoSql = require('../Models/FormaPagoSql');
var ImpuestoSql = require('../Models/ImpuestoGlobalSql');
var AdicionalesSql = require('../Models/AdicionalesSql');
var DetalleSql = require('../Models/DetallesSql');
var ImpuestoDetalleSql = require('../Models/ImpuerstoSqlDetalle');
module.exports = {

    //llena la factura segun el formato para genera el xlm
    processFactura: function (vec) {
        log.register('Lectura de Excel');
        var workbook = XLSX.readFile('ExcelFiles\\facturas.xls');
        var name_sheet = workbook.SheetNames[0];
        var sheet = workbook.Sheets[name_sheet];
        ;
        //var vec=  response;
        var controlRepet = 0;

        var factura = new Factura();

        var n = vec.length;
        var count = 0;
        var repetido = 0;
        var lastNumber = 0;
        var facturas = [];
        var cont_factura_actual = 0;
        for (var i = 0; i < n; i++) {

            aux = vec[i + 1]
            /*        if(aux!== undefined) {*/

            if (i === 0) {
                controlRepet = 0;
                controlRepet++;
                count++;
                factura = new Factura();
                var numAux = vec[i].numfac.split('-');

                factura.secuencial.value = numAux[1];
                log.register('Creacion Factura' + factura.secuencial.value);
                var dateAux = vec[i].fecfac.split(' ');
                factura.fecha_emision.value = dateAux[0];
                console.log(vec[1]);
                lastNumber = vec[i].numfac;
                //verificacion si es cedula o ruc para asignar el codigo
                if (vec[i].codcli !== '9999999999999') {
                    vec[i].codcli = vec[i].codcli.trim();
                    var cantidad = vec[i].codcli.length;

                    switch (cantidad) {

                        case 10: factura.tipo_identifiacion_comprador.value = identificaciones.cedula; break;
                        case 13: factura.tipo_identifiacion_comprador.value = identificaciones.ruc; break;
                        default: factura.tipo_identifiacion_comprador.value = identificaciones.pasaporte; break;
                    }
                }
                var nombre = vec[i].nomcli.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                factura.razon_social_comprador.value = nombre;
                factura.identificacion_comprador.value = vec[i].codcli;
                var cli = clients.get(factura.identificacion_comprador.value);
                if (cli != undefined) {
                    factura.direccion_comprador.value = cli.direccion;
                }

                //pendiente la direccion del cliente
                factura.total_sin_impuestos.value = vec[i].totnet;
                factura.total_descuento.value = vec[i].totdes;
                factura.importe_total.value = vec[i].totfac;

                /*agregar la parte de impuestos totales*/
                var impuestoTotal = new Impuesto();
                // console.log(impuestoTotal);
                impuestoTotal.base_imponible.value = factura.total_sin_impuestos.value;
                impuestoTotal.tarifa.value = porcentaje.doce;
                impuestoTotal.valor.value = vec[i].totiva;
                factura.total_con_impuestos.value.push(impuestoTotal);

                var pagoFac = new Pago();
                /*parte de pagos*/
                if (vec[i].totfac > 1000) {
                    pagoFac.forma_pago.value = codigosFormas.otros_con_financiero;
                    pagoFac.plazo.value = '45';
                }

                pagoFac.unidad_tiempo.value = 'dias';
                pagoFac.total.value = vec[i].totfac;
                factura.pagos.value.push(pagoFac);
                var detalle = new Detalle();

                detalle.codigo_principal.value = vec[i].codart.trim();
                var desc = vec[i].nomart.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                detalle.descripcion.value = desc;
                detalle.cantidad.value = vec[i].cantid;
                detalle.precio_unitario.value = vec[i].preuni;
                detalle.precio_total_sin_impuesto.value = vec[i].totren;

                /*calculo impuesto del detalle*/

                var ivaIndividual = new Big(detalle.precio_total_sin_impuesto.value);
                var impuestoIndividual = new Impuesto();
                impuestoIndividual.base_imponible.value = vec[i].totren;
                impuestoIndividual.tarifa.value = porcentaje.doce;
                // impuestoIndividual.valor.value=ivaIndividual.multiply(porcentajeIva.doce);
                ivaIndividual = ivaIndividual.times(porcentajeIva.doce).toFixed(2).toString();
                //console.log(ivaIndividual+'big');
                impuestoIndividual.valor.value = ivaIndividual;
                detalle.impuestos.value[0] = impuestoIndividual;
                factura.detalles.value.push(detalle);

                var adicionales = new Adicionales();

                if (cli != undefined) {
                    adicionales = new Adicionales();
                    adicionales.adicional.nombre = 'emailCliente'
                    adicionales.adicional.value = cli.mail;
                    factura.info_adicional.value.push(adicionales);
                    adicionales = new Adicionales();
                    adicionales.adicional.nombre = 'telefono'
                    adicionales.adicional.value = cli.telefono;
                    factura.info_adicional.value.push(adicionales);
                }



                facturas.push(factura);

                cont_factura_actual = i;





                //detalle
                //adicionales
                //     console.log(factura);
            } else {
                factura = new Factura();
                var numAux = vec[i].numfac.split('-');

                factura.secuencial.value = numAux[1];
                log.register('Creacion Factura' + factura.secuencial.value);
                var dateAux = vec[i].fecfac.split(' ');
                factura.fecha_emision.value = dateAux[0];

                lastNumber = vec[i].numfac;
                //verificacion si es cedula o ruc para asignar el codigo
                if (vec[i].codcli !== '9999999999999') {
                    vec[i].codcli = vec[i].codcli.trim();
                    var cantidad = vec[i].codcli.length;

                    switch (cantidad) {

                        case 10: factura.tipo_identifiacion_comprador.value = identificaciones.cedula; break;
                        case 13: factura.tipo_identifiacion_comprador.value = identificaciones.ruc; break;
                        default: factura.tipo_identifiacion_comprador.value = identificaciones.pasaporte; break;
                    }
                }
                var nombre = vec[i].nomcli.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                factura.razon_social_comprador.value = nombre;
                factura.identificacion_comprador.value = vec[i].codcli;

                //var ci = factura.identificacion_comprador.value;
                var ci = '1303963712 ';
                var cli = clients.get(factura.identificacion_comprador.value);
                if (cli != undefined) {
                    factura.direccion_comprador.value = cli.direccion;
                }
                factura.total_sin_impuestos.value = vec[i].totnet;
                factura.total_descuento.value = vec[i].totdes;
                factura.importe_total.value = vec[i].totfac;

                /*agregar la parte de impuestos totales*/
                var impuestoTotal = new Impuesto();
                // console.log(impuestoTotal);
                impuestoTotal.base_imponible.value = factura.total_sin_impuestos.value;
                impuestoTotal.tarifa.value = porcentaje.doce;
                impuestoIndividual.tarifa.value = porcentaje.doce;
                impuestoTotal.valor.value = vec[i].totiva;
                if (factura.secuencial.value === facturas[cont_factura_actual].secuencial.value) {
                    factura.total_con_impuestos = facturas[cont_factura_actual].total_con_impuestos;
                    factura.total_con_impuestos.value[0] = (impuestoTotal);
                } else {
                    factura.total_con_impuestos.value.push(impuestoTotal);
                }

                var pagoFac = new Pago();
                /*parte de pagos*/
                if (vec[i].totfac > 1000) {
                    pagoFac.forma_pago.value = codigosFormas.otros_con_financiero;
                    pagoFac.plazo.value = '45';
                }

                pagoFac.unidad_tiempo.value = 'dias';
                pagoFac.total.value = vec[i].totfac;
                if (factura.secuencial.value === facturas[cont_factura_actual].secuencial.value) {
                    factura.pagos = facturas[cont_factura_actual].pagos;
                    factura.pagos.value[0] = (pagoFac);
                } else {
                    factura.pagos.value.push(pagoFac);
                }
                var newDetalle = new Detalle();
                newDetalle.codigo_principal.value = vec[i].codart.trim();
                var desc = vec[i].nomart.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');
                newDetalle.descripcion.value = desc;
                newDetalle.cantidad.value = vec[i].cantid;
                newDetalle.precio_unitario.value = vec[i].preuni;
                newDetalle.precio_total_sin_impuesto.value = vec[i].totren;

                var ivaIndividual = new Big(vec[i].totren);
                var impuestoIndividual = new Impuesto();
                impuestoIndividual.base_imponible.value = vec[i].totren;
                impuestoIndividual.tarifa.value = porcentaje.doce;
                // impuestoIndividual.valor.value=ivaIndividual.multiply(porcentajeIva.doce);
                ivaIndividual = ivaIndividual.times(porcentajeIva.doce).toFixed(2).toString();
                //console.log(ivaIndividual+'big');
                impuestoIndividual.valor.value = ivaIndividual;
                newDetalle.impuestos.value[0] = impuestoIndividual;
                if (factura.secuencial.value === facturas[cont_factura_actual].secuencial.value) {
                    factura.detalles = facturas[cont_factura_actual].detalles;
                    factura.detalles.value.push(newDetalle);
                } else {
                    factura.detalles.value.push(newDetalle);
                }

                var adicionales = new Adicionales();



                if (factura.secuencial.value === facturas[cont_factura_actual].secuencial.value) {
                    adicionales = new Adicionales();
                    adicionales.adicional.nombre = 'email'
                    adicionales.adicional.value = cli.mail;
                    factura.info_adicional.value[0] = (adicionales);
                    adicionales = new Adicionales();
                    adicionales.adicional.nombre = 'telefono'
                    adicionales.adicional.value = cli.telefono;
                    factura.info_adicional.value[1] = (adicionales);
                    facturas[cont_factura_actual] = factura;
                } else {
                    if (cli != undefined) {
                        adicionales = new Adicionales();
                        adicionales.adicional.nombre = 'emailCliente'
                        adicionales.adicional.value = cli.mail;
                        factura.info_adicional.value.push(adicionales);
                        adicionales = new Adicionales();
                        adicionales.adicional.nombre = 'telefono'
                        adicionales.adicional.value = cli.telefono;
                        factura.info_adicional.value.push(adicionales);
                    }
                    facturas.push(factura);
                    cont_factura_actual++;
                }

            }

        }


        var m = facturas.length;
        //console.log(facturas);
        for (var i = 0; i < m; i++) {
            //console.log(i);
            var xml = document.generateFactura(facturas[i]);
            wtiteXml.write(xml, facturas[i].secuencial.value);
        }

        // console.log(count);
        // console.log(repetido);
        return (vec[0]);
    },
    processFacturaSql: function (factura, facturaActual, cantidad, actual, subtotal, descuento) {

        var flag = {
            infoTributaria: true
        };
        if (actual === 0) {// la primera vez ingresa en todas las tablas que se hace un insert las demas iteracciones solo guarda lo que son detalles
            var sec = factura[2].value;
            var sec = sec.toString();
            facturaActual.informacion.secuencial = Validate.secuencial(sec);
            var date = Validate.fixDateFormat(factura[1].value);
            facturaActual.informacion.fecha_emision = date;
            facturaActual.informacion.razon_social_comprador = factura[4].value;
            var aux = factura[9].value;//aqui la cedula
            if (aux !== '9999999999999') {

                var cantidad = aux.length;

                switch (cantidad) {

                    case 10: facturaActual.informacion.tipo_identifiacion_comprador = identificaciones.cedula; break;
                    case 13: facturaActual.informacion.tipo_identifiacion_comprador = identificaciones.ruc; break;
                    default: facturaActual.informacion.tipo_identifiacion_comprador = identificaciones.pasaporte; break;
                }
            }
            //agregar la identificacion del comprador
            facturaActual.informacion.identificacion_comprador = aux;
            facturaActual.informacion.direccion_comprador = factura[5].value;
            if (subtotal == undefined) {
                facturaActual.informacion.total_sin_impuestos = factura[16].value;
            } else {
                facturaActual.informacion.total_sin_impuestos = subtotal;
            }

            if (descuento.descuentoTotal == '') {
                facturaActual.informacion.total_descuento = 0;
            } else {
                facturaActual.informacion.total_descuento = descuento.descuentoTotal;
            }

            facturaActual.informacion.importe_total = factura[20].value * -1;

            if (flag.infoTributaria) {
                flag.infoTributaria = false;
                var sql = sqls.sqlInsertInfoTributaria(facturaActual.informacion);
                var resp = DataBase.executeSql(sql);//DEVUELVE EL ID 

            }


            if (resp.length > 0) {
                var id = resp[0];
                facturaActual.informacion.id_documento = id[0].value;
                var forma = factura[21].value;
                if (forma == null) {
                    forma = "Due";
                }

                var vecForma = forma.split(' ');
                var formaPago = new PagoSql();
                if (vecForma[0] == 'Net') {
                    formaPago.plazo = vecForma[1];
                    formaPago.total = facturaActual.informacion.importe_total;
                    formaPago.id_documento = facturaActual.informacion.id_documento;
                    formaPago.id_pago = actual + 1;
                } else {
                    formaPago.total = facturaActual.informacion.importe_total;
                    formaPago.id_pago = actual + 1;
                    formaPago.id_documento = facturaActual.informacion.id_documento;
                }
                var sql2 = sqls.sqlInsertPagos(formaPago);
                var resp2 = DataBase.executeSql(sql2);

                var impuesto = new ImpuestoSql();
                impuesto.base_imponible = facturaActual.informacion.total_sin_impuestos;
                impuesto.valor = factura[19].value;
                impuesto.id_impuesto = actual + 1;
                impuesto.id_documento = facturaActual.informacion.id_documento;
                var sql3 = sqls.sqlInsertImpuestos(impuesto);
                var resp3 = DataBase.executeSql(sql3);
                cont = 0;
                if (factura[7].value != null) {
                    var adicional = new AdicionalesSql();
                    adicional.id_documento = facturaActual.informacion.id_documento;
                    adicional.etiqueta = 'email';
                    adicional.valor_campo = factura[7].value;
                    adicional.id_campoAdicional = cont + 1;
                    cont++;
                    var sql4 = sqls.sqlInsertAdicionales(adicional);
                    var resp4 = DataBase.executeSql(sql4);
                }

                if (factura[8].value != null) {
                    var adicional = new AdicionalesSql();
                    adicional.id_documento = facturaActual.informacion.id_documento;
                    adicional.etiqueta = 'telefono';
                    adicional.valor_campo = factura[8].value;
                    adicional.id_campoAdicional = cont + 1;
                    cont++;
                    var sql5 = sqls.sqlInsertAdicionales(adicional);
                    var resp5 = DataBase.executeSql(sql5);
                }


                if (factura[11].value !== 'Descuento' && factura[11].value !== 'Sub-total' && factura[11].value !== null && factura[11].value !== 'Total sin  Iva') {//para saber si es un item si no lo es no se agrega
                    var detalle = new DetalleSql();

                    detalle.id_documento = facturaActual.informacion.id_documento;
                    detalle.id_detalle = actual + 1;
                    detalle.codigo_principal = factura[10].value;

                    var descrip = factura[12].value;

                    if(descrip!==null)
                    {
                        if (descrip.length > 300) {
                            descrip = descrip.substring(0, 299);
                        }
                        descrip = descrip.replace("'","");
                    }

                    detalle.descripcion = descrip;
                    if(factura[13].value!==null){
                        detalle.cantidad = factura[13].value;
                    }else{
                        detalle.cantidad = 0;
                    }
                    
                    if(factura[14].value!=null){
                    detalle.precio_unitario = factura[14].value;
                    }else{
                        detalle.precio_unitario = 0;
                    }
                    
                    if (descuento.descuentoIndividual == '') {
                        detalle.descuento = 0;
                    } else {
                        detalle.descuento = descuento.descuentoIndividual;
                    }

                    detalle.precio_total_sin_impuesto = factura[16].value;

                    var sql6 = sqls.sqlInsertDetalles(detalle);
                    var resp6 = DataBase.executeSql(sql6);

                    var id_detalle = resp6[0];
                    id_detalle = id_detalle[0].value;

                    if (id_detalle != undefined) {
                        var impuestoDetalis = new ImpuestoDetalleSql();
                        impuestoDetalis.id_documento = facturaActual.informacion.id_documento;
                        impuestoDetalis.id_detalle = id_detalle;
                        impuestoDetalis.id_dimpuesto = actual + 1;
                        impuestoDetalis.base_imponible = factura[16].value;
                        var num = new Big(factura[16].value);
                        var tarifa = new Big(impuestoDetalis.tarifa);
                        var porcentaje = tarifa.div(100);
                        var resp = num.times(porcentaje).toFixed(2).toString();
                        impuestoDetalis.valor = resp;
                        var sql7 = sqls.sqlInsertDetallesImpuesto(impuestoDetalis);
                        var resp7 = DataBase.executeSql(sql7);

                    }




                }
            } else {
                log.register('Error al ingresar informacion tributaria');
            }

        } else {// aqui porcesa cuando es mas de un item y solo almacena los detalles y los impuestos del detalle


            if (factura[11].value !== 'Descuento' && factura[11].value !== 'Sub-total' && factura[11].value !== null && factura[11].value !== 'Total sin  Iva') {//para saber si es un item si no lo es no se agrega
                var detalle = new DetalleSql();

                detalle.id_documento = facturaActual.informacion.id_documento;
                detalle.id_detalle = actual + 1;
                detalle.codigo_principal = factura[10].value;

                var descrip = factura[12].value;

                if(descrip!==null)
                {
                    if (descrip.length > 300) {
                        descrip = descrip.substring(0, 299);
                    }
                    descrip = descrip.replace("'","");
                }

                detalle.descripcion = descrip;
                if(factura[13].value!==null){
                    detalle.cantidad = factura[13].value;
                }else{
                    detalle.cantidad = 0;
                }
                
                if(factura[14].value!==null){
                detalle.precio_unitario = factura[14].value;
                }else{
                    detalle.precio_unitario = 0;
                }
                
                if (descuento.descuentoIndividual == '') {
                    detalle.descuento = 0;
                } else {
                    detalle.descuento = descuento.descuentoIndividual;
                }

                detalle.precio_total_sin_impuesto = factura[16].value;

                var sql6 = sqls.sqlInsertDetalles(detalle);
                var resp6 = DataBase.executeSql(sql6);

                var id_detalle = resp6[0];
                id_detalle = id_detalle[0].value;

                if (id_detalle != undefined) {
                    var impuestoDetalis = new ImpuestoDetalleSql();
                    impuestoDetalis.id_documento = facturaActual.informacion.id_documento;
                    impuestoDetalis.id_detalle = id_detalle;
                    impuestoDetalis.id_dimpuesto = actual + 1;
                    impuestoDetalis.base_imponible = factura[16].value;
                    var num = new Big(factura[16].value);
                    var tarifa = new Big(impuestoDetalis.tarifa);
                    var porcentaje = tarifa.div(100);
                    var resp = num.times(porcentaje).toFixed(2).toString();
                    impuestoDetalis.valor = resp;
                    var sql7 = sqls.sqlInsertDetallesImpuesto(impuestoDetalis);
                    var resp7 = DataBase.executeSql(sql7);

                }



            }



        }
        //console.log(factura);
        return facturaActual;
    },

    loadSubtotal: function (rows) {
        var n = rows.length
        var SubtotalDescuento;


        if (rows[11].value === 'Sub-total') {
            SubtotalDescuento = rows[17].value;
        }

        return SubtotalDescuento;
    },
    loadDescuento: function (rows, cant) {
        var n = rows.length
        var SubtotalDescuento = {
            descuentoTotal: '',
            descuentoIndividual: ''
        }


        if (rows[11].value === 'Descuento') {
            SubtotalDescuento.descuentoTotal = rows[16].value * -1;
            var desc = new Big(rows[17].value * -1);
            var resp = desc.div(cant);
            SubtotalDescuento.descuentoIndividual = parseFloat(resp.toFixed(2).toString());
        }


        return SubtotalDescuento;
    },
    cantArti: function (rows) {
        var count = 0;
        var n = rows.length;
        for (var i = 0; i < n; i++) {
            var aux = rows[i];
            if (aux[11].value !== 'Descuento' && aux[11].value !== 'Sub-total' && aux[11].value !== null && aux[11].value !== 'Total sin  Iva') {
                count++;
            }
        }
        return count;
    }

}