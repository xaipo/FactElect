/**
 * Created by xaipo on 1/29/2018.
 */
module.exports = {

   sqlRead: function (query){
       var resilt="SELECT "+
   "OrderHeaders.OrderID as ordenId, "+
   "OrderHeaders.StationID as orderStationId, "+
   "OrderHeaders.OrderDateTime as ordenFecha, "+
   "OrderHeaders.FacturaNumber as ordenNumeroFactura, "+
   "CustomerFiles.CustomerName as clienteNombre, "+
   "CustomerFiles.DeliveryAddress as clienteDireccion, "+
   "CustomerFiles.CrossStreet as clienteCI, "+
   "CustomerFiles.EmailAddress as clienteEmail, "+
   "CustomerFiles.PhoneNumber as clienteTelefono, "+
   "OrderHeaders.SalesTaxRate as porcentajeImpuesto, "+
   "OrderHeaders.SalesTaxAmountUsed as cantidadImpuesto, "+
   "OrderHeaders.SubTotal as subtotal, "+
   "OrderHeaders.AmountDue as totalAPagar, "+
   "OrderHeaders.CashDiscountAmount as descuento, "+
   "OrderHeaders.SurchargeAmount as valorServicios, "+
   "MenuItems.MenuItemId as itemId, "+
   "MenuItems.MenuItemText as itemNombre, "+
   "OrderTransactions.DiscountTaxable as itemIsImpuestoDescuento, "+
   "OrderTransactions.DiscountAmount as itemDescuentoCantidad, "+
   "OrderTransactions.DiscountBasis as itemDescuentoBase, "+
   "OrderTransactions.DiscountAmountUsed as itemDescuentoValor, "+
   "OrderTransactions.MenuItemUnitPrice as itemPrecioUnitario, "+
   "OrderTransactions.Quantity as itemCantidad, "+
   "OrderTransactions.ExtendedPrice as itemTotalAplicadoDescuento "+
   "FROM MenuItems "+
   "INNER JOIN "+
   "(CustomerFiles "+
   "INNER JOIN "+
   "(OrderHeaders "+
   "INNER JOIN "+
   "OrderTransactions "+
   "ON OrderHeaders.OrderID = OrderTransactions.OrderID) "+
   "ON CustomerFiles.CustomerID = OrderHeaders.CustomerID) "+
   "ON MenuItems.MenuItemID = OrderTransactions.MenuItemID "+
   "WHERE OrderHeaders.OrderId="+query+";"

   return resilt;
   }

}