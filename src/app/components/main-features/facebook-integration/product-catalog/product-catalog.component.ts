import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html'
})
export class ProductCatalogComponent implements OnInit {
  isProcessing = false;
  constructor() { }

  ngOnInit() {
  }

}
