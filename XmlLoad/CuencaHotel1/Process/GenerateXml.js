/**
 * Created by xaipo on 1/15/2018.
 */
var builder = require('xmlbuilder');
var wtiteXml = require('./SaveDocument');
var HashMap = require('hashmap');
module.exports = {

    generateFactura: function (factura) {
        console.log("generar Factura"+'-'+factura.secuencial.value);

        var n = factura.total_con_impuestos.value.length;
        var totalImpuesto = {};

//todo el encabezado

        var xml = builder.create({
            factura: {
                '@id': 'comprabante', '@version': '2.1.0',

            }
        }, {encoding: 'UTF-8'}).ele('informacionTributaria');

        // var peopleNode = xmlbuilder.create('roster').ele('people');
        xml.ele(factura.ambiente.tag, factura.ambiente.value);
        xml.ele(factura.tipo_emision.tag, factura.tipo_emision.value);
        xml.ele(factura.razon_social.tag, factura.razon_social.value);
        xml.ele(factura.ruc.tag, factura.ruc.value);
        xml.ele(factura.clave_ccesso.tag, factura.clave_ccesso.value);
        xml.ele(factura.codigo_documento.tag, factura.codigo_documento.value);
        xml.ele(factura.establecimiento.tag, factura.establecimiento.value);
        xml.ele(factura.punto_emision.tag, factura.punto_emision.value);
        xml.ele(factura.secuencial.tag, factura.secuencial.value);
        xml.ele(factura.direccion_matriz.tag, factura.direccion_matriz.value);

        xml.up().ele('infoFactura')
            .ele(factura.fecha_emision.tag, factura.fecha_emision.value).up()
            .ele(factura.direccion_establecimiento.tag, factura.direccion_establecimiento.value).up()
            .ele(factura.obligado_llevar_contabilidad.tag, factura.obligado_llevar_contabilidad.value).up()
            //.ele(factura.contribuyente_especial.tag, factura.contribuyente_especial.value).up()
            .ele(factura.tipo_identifiacion_comprador.tag, factura.tipo_identifiacion_comprador.value).up()
            .ele(factura.razon_social_comprador.tag, factura.razon_social_comprador.value).up()
            .ele(factura.identificacion_comprador.tag, factura.identificacion_comprador.value).up()
            .ele(factura.direccion_comprador.tag, factura.direccion_comprador.value).up()
            .ele(factura.total_sin_impuestos.tag, factura.total_sin_impuestos.value).up()
            .ele(factura.total_descuento.tag, factura.total_descuento.value);

//parte de impuestos
        person = builder.create('totalConImpuesto');

        var n = factura.total_con_impuestos.value.length;
        for (var i = 0; i < n; i++) {
            // Create an XML fragment


            person.element('totalImpuesto')
                .ele(factura.total_con_impuestos.value[i].codigo.tag, factura.total_con_impuestos.value[i].codigo.value).up()
                .ele(factura.total_con_impuestos.value[i].codigo_porcentaje.tag, factura.total_con_impuestos.value[i].codigo_porcentaje.value).up()
                .ele(factura.total_con_impuestos.value[i].base_imponible.tag, factura.total_con_impuestos.value[i].base_imponible.value).up()
                .ele(factura.total_con_impuestos.value[i].tarifa.tag, factura.total_con_impuestos.value[i].tarifa.value).up()
                .ele(factura.total_con_impuestos.value[i].valor.tag, factura.total_con_impuestos.value[i].valor.value)
            ;
            // Import the root node of the fragment after
            // the people node of the main XML document

        }
        xml.next().importDocument(person);
        xml.next()
            .ele(factura.propina.tag, factura.propina.value).up()
            .ele(factura.importe_total.tag, factura.importe_total.value).up()
            .ele(factura.moneda.tag, factura.moneda.value).up();


//parte de pagos
        person = builder.create('pagos');

        n = factura.pagos.value.length;
        for (var i = 0; i < n; i++) {
            // Create an XML fragment
            // console.log(factura.total_con_impuestos.value[0]);

            console.log(n +'numero array de pagos');
            console.log(factura.pagos.value[i].forma_pago.tag +'tag' +factura.secuencial.value);

            person.element('pago')
                .ele(factura.pagos.value[i].forma_pago.tag, factura.pagos.value[i].forma_pago.value).up()
                .ele(factura.pagos.value[i].total.tag, factura.pagos.value[i].total.value).up()
                .ele(factura.pagos.value[i].plazo.tag, factura.pagos.value[i].plazo.value).up()
                .ele(factura.pagos.value[i].unidad_tiempo.tag, factura.pagos.value[i].unidad_tiempo.value).up()

            ;
            // Import the root node of the fragment after
            // the people node of the main XML document

        }
        xml.next().importDocument(person);


//parte detalle de la factura

        person = builder.create('detalles');

        n = factura.detalles.value.length;
        for (var i = 0; i < n; i++) {
            // Create an XML fragment
            // console.log(factura.total_con_impuestos.value[0]);

            console.log(n);
            var item = person.ele('detalle')
                .ele(factura.detalles.value[i].codigo_principal.tag, factura.detalles.value[i].codigo_principal.value).up()
                .ele(factura.detalles.value[i].descripcion.tag, factura.detalles.value[i].descripcion.value).up()
                .ele(factura.detalles.value[i].cantidad.tag, factura.detalles.value[i].cantidad.value).up()
                .ele(factura.detalles.value[i].precio_unitario.tag, factura.detalles.value[i].precio_unitario.value).up()
                .ele(factura.detalles.value[i].descuento.tag, factura.detalles.value[i].descuento.value).up()
                .ele(factura.detalles.value[i].precio_total_sin_impuesto.tag, factura.detalles.value[i].precio_total_sin_impuesto.value).up();


//impuestos detalle de factura por cada producto

            ;
            var item2 = item.ele('impuestos');

            m = factura.detalles.value[i].impuestos.value.length;
            for (var j = 0; j < m; j++) {
                // Create an XML fragment
                // console.log(factura.total_con_impuestos.value[0]);

               // console.log(person.children);

                item2.ele('impuesto')
                    .ele(factura.detalles.value[i].impuestos.value[j].codigo.tag, factura.detalles.value[i].impuestos.value[j].codigo.value).up()
                    .ele(factura.detalles.value[i].impuestos.value[j].codigo_porcentaje.tag, factura.detalles.value[i].impuestos.value[j].codigo_porcentaje.value).up()
                    .ele(factura.detalles.value[i].impuestos.value[j].base_imponible.tag, factura.detalles.value[i].impuestos.value[j].base_imponible.value).up()
                    .ele(factura.detalles.value[i].impuestos.value[j].tarifa.tag, factura.detalles.value[i].impuestos.value[j].tarifa.value).up()
                    .ele(factura.detalles.value[i].impuestos.value[j].valor.tag, factura.detalles.value[i].impuestos.value[j].valor.value)
                ;
//impuestos detalle de factura por cada producto


                // Import the root node of the fragment after
                // the people node of the main XML document

            }

            // Import the root node of the fragment after
            // the people node of the main XML document

        }
        xml.next().up().importDocument(person);


        person = builder.create('infoAdicional');

        n = factura.info_adicional.value.length;
        for (var i = 0; i < n; i++) {
            // Create an XML fragment
            // console.log(factura.total_con_impuestos.value[0]);

            var nomb=factura.info_adicional.value[i].tag;
            var val=factura.info_adicional.value[i].nombre;
           // console.log(n);
            person.element('campoAdicional',{nomb:val},factura.info_adicional.value[i].value)

            ;
            // Import the root node of the fragment after
            // the people node of the main XML document

        }
        xml.next().up().importDocument(person);

        xml = xml.end({
            pretty: true,
            indent: '  ',
            newline: '\n',
            allowEmpty: false,
            spacebeforeslash: ''
        });

        return (xml);

    }
}
