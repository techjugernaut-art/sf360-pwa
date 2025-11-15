import { Component, OnInit, Inject } from '@angular/core';
import { IDialogData } from 'src/app/interfaces/dialog-data.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExportDocumentsService } from '../../../../services/export-documents.service';

@Component({
  selector: 'app-sales-order-detail',
  templateUrl: './sales-order-detail.component.html',
  styleUrls: ['./sales-order-detail.component.scss']
})
export class SalesOrderDetailDialogComponent implements OnInit {
  salesOrderItems = [];
  constructor(
    private exportDocs: ExportDocumentsService,
    public dialogRef: MatDialogRef<SalesOrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData
  ) { }

  ngOnInit() {
  }
  /**
   * Export order detail as PDF Document
   */
  exportAsPDF() {
    this.exportDocs.exportAsPDF('Sales Order: ' + this.data.data.order_code, 'salesOrderModalBody');
  }
}
