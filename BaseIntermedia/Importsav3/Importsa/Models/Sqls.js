module.exports = {

    sqlRead: function (id) {
        var sql = 'SELECT A.TxnID as id,' +
            'A.TxnDate as fecha,' +
            'A.TxnNumber as sequencial,' +
            'A.CustomField1 as clientCI,' +
            'A.BillAddress_Addr1 as clienteNombre,' +
            'A.BillAddress_Addr2 as clienteDireccion,' +
            'A.CustomerRef_ListID as clienteID,' +
            'C.Email as email,' +
            'C.Phone as telefono,' +
            'C.AccountNumber as ci_alternativo,' +
            'B.ItemRef_ListID as itemId,' +
            'B.ItemRef_FullName as itemName,' +
            'B.[Desc] as itemDescripcion,' +
            'B.Quantity as itemCantidad,' +
            'B.Rate as itemPrecioUnitario,' +
            'B.RatePercent as itemPorcentajeDescuento,' +
            'B.Amount as itemPrecioTotal,' +
            'A.Subtotal as sutotal,' +
            'A.SalesTaxPercentage as porcentajeImpuesto,' +
            'A.SalesTaxTotal as valorImpuesto,' +
            'A.AppliedAmount as totalNegativo,' +
            'A.TermsRef_FullName as formaPago ' +
            'from dbo.invoice as A ' +
            'INNER JOIN dbo.invoicelinedetail as B ' +
            'on A.TxnID like B.IDKEY ' +
            'INNER JOIN dbo.customer as C ' +
            'on A.CustomerRef_ListID like C.ListID ' +
            'WHERE A.TxnNumber = ' + id;
        return (sql);
    },
    sqlCountRows: function (id) {
        var sql = 'select COUNT(TxnNumber) from invoice where TxnNumber>' + id;
        return (sql);
    },
    sqlTopRows: function (id) {
        var sql = 'select TOP 1(TxnNumber) from invoice where ' + id + '<TxnNumber order by 1 asc';
        return (sql);
    },
    sqlInsertInfoTributaria(info) {
        var sql = 'INSERT INTO [IExtract].[dbo].[infoTributaria] ' +

            ' ([id_documento ],' +
            '[razonSocial]' +
            ' ,[nombreComercial]' +
            ' ,[rucEmisor]' +
            // ',[contribuyenteEspecial]'+
            ',[obligadoContabilidad]' +
            ',[dirMatriz]' +
            ',[dirEstablecimiento]' +
            ',[codDoc]' +
            ',[establecimiento]' +
            ',[punto_emision]' +
            ',[secuencia_fiscal]' +
            ',[fechaEmision]' +
            ',[tipoIdentificacionReceptorDoc]' +
            ',[razonSocialReceptorDoc]' +
            ',[identificacionReceptorDoc]' +
            ',[direccionReceptorDoc]' +
            ',[totalSinImpuesto ]' +
            ',[totalDescuento]' +
            ',[propina]' +
            ',[importeTotal]' +
            ',[moneda]' +
            ',[estado])  ' +
            ' OUTPUT(INSERTED.[id_documento ]) ' +
            ' VALUES ' +

            "(" + info.secuencial + "," +
            "'" + info.razon_social + "'," +
            "'" + info.nombre_comercial + "'," +
            "'" + info.ruc + "'," +
            //  "'"+info.contribuyente_especial+"',"+
            "'" + info.obligado_llevar_contabilidad + "'," +
            "'" + info.direccion_matriz + "'," +
            "'" + info.direccion_establecimiento + "'," +
            "" + info.codigo_documento + "," +
            "" + info.establecimiento + "," +
            "" + info.punto_emision + "," +
            "" + info.secuencial + "," +
            "'" + info.fecha_emision + "'," +
            "" + info.tipo_identifiacion_comprador + "," +
            "'" + info.razon_social_comprador + "'," +
            "'" + info.identificacion_comprador + "'," +
            "'" + info.direccion_comprador + "'," +
            "" + info.total_sin_impuestos + "," +
            "" + info.total_descuento + "," +
            "" + info.propina + "," +
            "" + info.importe_total + "," +
            "'" + info.moneda + "'," +
            "" + info.estado + ")";
        return sql;
    },
    sqlInsertPagos: function (formaPago) {
        var sql = 'INSERT INTO [IExtract].[dbo].[FormasPagos]([id_documento ]' +
            ',[id_pago]' +
            ',[formaPago]' +
            ',[total]' +
            ',[plazo]' +
            ',[unidadTiempo]) ' +
            'VALUES ' +
            '(' + formaPago.id_documento + '' +
            ',' + formaPago.id_pago + '' +
            ',' + formaPago.forma_pago + '' +
            ',' + formaPago.total + '' +
            ',' + formaPago.plazo + '' +
            ",'" + formaPago.unidad_tiempo + "')"
        return sql;
    },
    sqlInsertImpuestos: function (impuesto) {

        var sql = 'INSERT INTO [IExtract].[dbo].[TImpuestos]' +
            '([id_timpuesto]' +
            ',[codigo]' +
            ',[codigoPorcentaje]' +
            ',[baseImponible]' +
            ',[tarifa]' +
            ',[valor]' +
            ',[id_documento ]) ' +
            'VALUES ' +
            '(' + impuesto.id_impuesto + '' +
            ',' + impuesto.codigo + '' +
            ',' + impuesto.codigo_porcentaje + '' +
            ',' + impuesto.base_imponible + '' +
            ',' + impuesto.tarifa + '' +
            ',' + impuesto.valor + '' +
            ',' + impuesto.id_documento + ')';
        return sql;
    },
    sqlInsertAdicionales: function (adicional) {

        var sql = 'INSERT INTO [IExtract].[dbo].[CamposAdicionales]' +
            '([id_campoAdicional]' +
            ',[etiqueta]' +
            ',[valor_campo]' +
            ',[id_documento ])' +
            'VALUES ' +
            '(' + adicional.id_campoAdicional + '' +
            ",'" + adicional.etiqueta + "'" +
            ",'" + adicional.valor_campo + "'" +
            ',' + adicional.id_documento + ')'
        return sql;
    },
    sqlInsertDetalles: function (detalle) {
        var sql = 'INSERT INTO [IExtract].[dbo].[detalles]' +
            '([id_detalle]' +
            ',[codigoPrincipal]' +
            ',[descripcion]' +
            ',[cantidad]' +
            ',[precioUnitario]' +
            ',[descuento]' +
            ',[precioTotalSinImpuesto]' +
            ',[id_documento ]) ' +
            ' OUTPUT(INSERTED.[id_detalle]) ' +
            'VALUES ' +
            '(' + detalle.id_detalle + '' +
            ",'" + detalle.codigo_principal + "'" +
            ",'" + detalle.descripcion + "'" +
            "," + detalle.cantidad + "" +
            "," + detalle.precio_unitario + "" +
            "," + detalle.descuento + "" +
            "," + detalle.precio_total_sin_impuesto + "" +
            "," + detalle.id_documento + ")"
        return sql;
    },
    sqlInsertDetallesImpuesto:function (detalleImpuesto){
       var sql= 'INSERT INTO [IExtract].[dbo].[DImpuestos]'+
           '([id_dimpuesto]'+
           ',[id_documento ]'+
           ',[id_detalle]'+
           ',[codigo]'+
           ',[codigoPorcentaje]'+
           ',[tarifa]'+
           ',[baseImponible]'+
           ',[valor_impuesto]) '+
     'VALUES '+
           '('+detalleImpuesto.id_dimpuesto+''+
           ','+detalleImpuesto.id_documento+''+
           ','+detalleImpuesto.id_detalle+''+
           ','+detalleImpuesto.codigo+''+
           ','+detalleImpuesto.codigo_porcentaje+''+
           ','+detalleImpuesto.tarifa+''+
           ','+detalleImpuesto.base_imponible+''+
           ','+detalleImpuesto.valor+')';
        return sql;
    }

}