import { GenerateProductBarcodesComponent } from './../generate-product-barcodes/generate-product-barcodes.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-generate-product-barcodes-params',
  templateUrl: './generate-product-barcodes-params.component.html',
  styleUrls: ['./generate-product-barcodes-params.component.scss']
})
export class GenerateProductBarcodesParamsComponent implements OnInit {
  product;
  formGroup: FormGroup;
  paperSizes = [];
  constructor(
    private dialogRef: MatDialogRef<GenerateProductBarcodesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      number_of_barcodes: new FormControl('', [Validators.required])
    });
    if (this.data !== null && this.data !== undefined) {
      this.product = this.data.product;
    }
  }
  onSubmit(data) {
    this.dialogRef.close(data);
  }
  onClose() {
    this.dialogRef.close(null);
  }
  get number_of_barcodes() { return this.formGroup.get('number_of_barcodes'); }
}
