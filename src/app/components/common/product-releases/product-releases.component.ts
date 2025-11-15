import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { ConstantValuesService } from 'src/app/services/constant-values.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-releases',
  templateUrl: './product-releases.component.html',
  styleUrls: ['./product-releases.component.scss']
})
export class ProductReleasesComponent implements OnInit {
  pageHeaderOptions: IPageHeader;
  currentSection = 'section1';
  constructor(
    private title: Title,
    private constantValues: ConstantValuesService) { }

  ngOnInit() {
    this.title.setTitle(this.constantValues.APP_NAME + ' | SF360 Product Releases');
    // tslint:disable-next-line:max-line-length
    this.pageHeaderOptions = { pageTitle: ' SF360 Product Releases', hasShopsFilter: false, ignoreFilterByAllShops: true, hideFilterPanel: true };
  }


  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  scrollTo(section) {
    document.querySelector('#' + section)
    .scrollIntoView();
  }


}
