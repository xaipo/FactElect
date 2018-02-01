module.exports={

    sqlRead: function (id){
        var sql='SELECT A.TxnID as id,'+
        'A.TxnDate as fecha,'+
        'A.TxnNumber as sequencial,'+
        'A.CustomField1 as clientCI,'+
        'A.BillAddress_Addr1 as clienteNombre,'+
        'A.BillAddress_Addr2 as clienteDireccion,'+
        'A.CustomerRef_ListID as clienteID,'+
        'C.Email as email,'+
        'C.Phone as telefono,'+
        'B.ItemRef_ListID as itemId,'+
        'B.ItemRef_FullName as itemName,'+
        'B.[Desc] as itemDescripcion,'+
        'B.Quantity as itemCantidad,'+
        'B.Rate as itemPrecioUnitario,'+
        'B.RatePercent as itemPorcentajeDescuento,'+
        'B.Amount as itemPrecioTotal,'+
        'A.Subtotal as sutotal,'+
        'A.SalesTaxPercentage as porcentajeImpuesto,'+
        'A.SalesTaxTotal as valorImpuesto,'+
        'A.AppliedAmount as totalNegativo,'+
        'A.TermsRef_FullName as formaPago '+
        'from dbo.invoice as A '+
        'INNER JOIN dbo.invoicelinedetail as B '+
        'on A.TxnID like B.IDKEY '+
        'INNER JOIN dbo.customer as C '+
        'on A.CustomerRef_ListID like C.ListID ' +
        'WHERE A.TxnNumber = '+id;
        return(sql);
    },
    sqlCountRows:function (id){
        var sql ='select COUNT(TxnNumber) from invoice where TxnNumber>'+id;
        return (sql);
    },
    sqlTopRows:function (id){
        var sql ='select TOP 1(TxnNumber) from invoice where '+id+'<TxnNumber order by 1 asc';
        return (sql);
    },
    sqlInsertInfoTributaria(info){
        'INSERT INTO [IExtract].[dbo].[infoTributaria]'+
        '([id_documento ]'+
       ' ,[razonSocial]'+
       ' ,[nombreComercial]'+
       ' ,[rucEmisor]'+
        ',[contribuyenteEspecial]'+
        ',[obligadoContabilidad]'+
        ',[dirMatriz]'+
        ',[dirEstablecimiento]'+
        ',[codDoc]'+
        ',[establecimiento]'+
        ',[punto_emision]'+
        ',[secuencia_fiscal]'+
        ',[fechaEmision]'+
        ',[tipoIdentificacionReceptorDoc]'+
        ',[razonSocialReceptorDoc]'+
        ',[identificacionReceptorDoc]'+
        ',[direccionReceptorDoc]'+
        ',[totalSinImpuesto ]'+
        ',[totalDescuento]'+
        ',[propina]'+
        ',[importeTotal]'+
        ',[moneda]'+
        ',[estado]'+
  ' VALUES'+
        '(<id_documento , numeric(20,0),>'+
        ',<razonSocial, varchar(300),>'+
        ',<nombreComercial, varchar(300),>'+
        ',<rucEmisor, varchar(20),>'+
        ',<contribuyenteEspecial, varchar(13),>'+
        ',<obligadoContabilidad, varchar(2),>'+
        ',<dirMatriz, varchar(300),>'+
        ',<dirEstablecimiento, varchar(300),>'+
        ',<codDoc, numeric(2,0),>'+
        ',<establecimiento, numeric(2,0),>'+
        ',<punto_emision, numeric(3,0),>'+
        ',<secuencia_fiscal, numeric(9,0),>'+
        ',<fechaEmision, varchar(10),>'+
        ',<tipoIdentificacionReceptorDoc, numeric(2,0),>'+
        ',<razonSocialReceptorDoc, varchar(300),>'+
        ',<identificacionReceptorDoc, varchar(20),>'+
        ',<direccionReceptorDoc, varchar(300),>'+
        ',<totalSinImpuesto , numeric(14,2),>'+
        ',<totalDescuento, numeric(14,2),>'+
        ',<propina, numeric(14,2),>'+
        ',<importeTotal, numeric(14,2),>'+
        ',<moneda, varchar(15),>'+
        ',<estado, numeric(1,0),>)'
    }
}