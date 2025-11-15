import { ExportDocumentsService } from './../../../../services/export-documents.service';
import { Component, Input, OnInit } from '@angular/core';
import { inOutAnimation } from 'src/app/utils/animations.animator';

@Component({
  selector: 'app-sales-order-list-item',
  templateUrl: './sales-order-list-item.component.html',
  styleUrls: ['./sales-order-list-item.component.scss'],
  animations: [inOutAnimation]
})
export class SalesOrderListItemComponent implements OnInit {
@Input() salesOrders = [];
salesOrderItems = [];
saleOrderDetail;
orderId = '';
  constructor(
    private exportDocs: ExportDocumentsService
  ) { }

  ngOnInit() {
  }

   /**
   * View sales order details using sales orders dialog
   * @param order order obect
   */
    viewOrderDetails(order) {
      this.saleOrderDetail = order;
      this.salesOrderItems = order.myitems;
    }

       /**
   * Collapse or Expand Order detail
   * @param order order detail
   */
  collapseOrderDetail(order) {
    if (order.id === this.orderId) {
      this.orderId = '';
      return;
    }
    this.orderId = order.id;
  }
   /**
   * Export order detail as PDF Document
   */
    exportAsPDF() {
      this.exportDocs.exportAsPDF('Sales Order: ' + this.saleOrderDetail.order_code, 'salesOrderModalBody');
    }
}
