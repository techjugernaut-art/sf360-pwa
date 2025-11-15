import { IJsPDFAutoTableColumn } from './../interfaces/jspdf-autotable-columns';
import { Injectable } from '@angular/core';
import JSPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable'


@Injectable({
  providedIn: 'root'
})
export class ExportDocumentsService {

  constructor(
  ) { }

  /**
   * Export element as PDF document
   * @param name Document name
   * @param elementId Element to download id
   * @param title Document Title
   * @param subject Document subject
   * @param author Document author
   */
  exportAsPDF(name: string, elementId: string, title?: string, subject?: string, author?: string) {
    const data = document.getElementById(elementId);

    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;

      // const imgHeight = canvas.height * imgWidth / canvas.width;
      const imgHeight = data.clientHeight * 25.4 / 96;
      // let imgHeight = 500;
      // const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new JSPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pagecount = Math.ceil(imgHeight / pageHeight);
      pdf.addImage(contentDataURL, 'PNG', 2, 0, pageWidth - 4, 0);
      if (pagecount > 0) {
        let j = 1;
        while (j !== pagecount) {
          pdf.addPage('a4');
          pdf.addImage(contentDataURL, 'PNG', 2, -(j * pageHeight), pageWidth - 4, 0);
          j++;
        }
      }
      pdf.save(name + '.pdf'); // Generated PDF
    });
  }
  /**
   * Export data as CSV document
   * @param name Document name
   * @param data Json dataset to download
   * @param title Document Title
   * @param subject Document subject
   * @param author Document author
   */
  exportAsCSV(name: string, data: any, title?: string, subject?: string, author?: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, name);
    XLSX.writeFile(wb, name + '.xlsx');
  }

  /**
   * Export element as  image
   * @param name Document name
   * @param elementId Element to download id
   */
  exportAsImage(name: string, elementId: string) {
    const data = document.getElementById(elementId);
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');

      link.download = name;
      link.href = contentDataURL;
      document.body.appendChild(link);
      link.click();
    });
  }


  exportTablePDF(name, shopName, productName, category, dateRange, columns: IJsPDFAutoTableColumn[], body: any[], footer: any[]) {
    const doc = new JSPDF();
    // Or use javascript directly:
    doc.text("Sales By Item Report", 15, 15);
    doc.setFontSize(12);
    doc.text("Shop Name: " + shopName, 15, 22);
    doc.text("Item: " + productName, 15, 29);
    doc.text("Category: " + category, 15, 36);
    doc.text("Date Range: " + dateRange, 15, 43);
    autoTable(doc, {
      startY: 50,
      pageBreak: 'auto',
      rowPageBreak: 'auto',
      showHead: 'everyPage',
      showFoot: 'lastPage',
      columnStyles: {

      },
      headStyles: {
        fontSize: 11,
        fillColor: '#026E08'
      } ,
      bodyStyles: {
        fontSize: 11
      },
      footStyles: {
        fontStyle: 'bold',
        fontSize: 11,
        fillColor: '#026E08'
      },
      columns: columns,
      body: body,
      foot: footer
    })

    doc.save(name + '.pdf')
  }

  genericExportTablePDF(reportTitle, fileName, shopName, dateRange, columns: IJsPDFAutoTableColumn[], body: any[], footer: any[]) {
    const doc = new JSPDF();
    // Or use javascript directly:
    doc.text(reportTitle, 15, 15);
    doc.setFontSize(12);
    doc.text("Shop Name: " + shopName, 15, 22);
    doc.text("Date Range: " + dateRange, 15, 29);
    autoTable(doc, {
      startY: 36,
      pageBreak: 'auto',
      rowPageBreak: 'auto',
      showHead: 'everyPage',
      showFoot: 'lastPage',
      columnStyles: {

      },
      headStyles: {
        fontSize: 8,
        fillColor: '#026E08'
      } ,
      bodyStyles: {
        fontSize: 8
      },
      footStyles: {
        fontStyle: 'bold',
        fontSize: 8,
        fillColor: '#026E08'
      },
      columns: columns,
      body: body,
      foot: footer
    })

    doc.save(fileName + '.pdf')
  }
}
