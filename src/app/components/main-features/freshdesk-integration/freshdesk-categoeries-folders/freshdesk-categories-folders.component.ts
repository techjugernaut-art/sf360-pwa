import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { FdkApiCallsService } from 'src/app/services/network-calls/fdk-api-calls.service';
declare var $: any;

@Component({
  templateUrl: './freshdesk-categories-folders.component.html'
})
export class FreshdeskCategoriesFolders implements OnInit {
  isProcessing = false;
  pageTitle = 'Knowledge Base'
  categoryContents = [];
  categoriesAll = [];
  searchFormControl: FormControl = new FormControl('');
  categoryFolders = [];
  tempCategoryFolders = [];
  isProcessingFolders: boolean;
  pageHeaderOptions: IPageHeader;

  constructor(
    private fdkApiCalls: FdkApiCallsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.pageHeaderOptions = { pageTitle: this.pageTitle, hideFilterPanel: true };

    this.searchFormControl.valueChanges.subscribe((value: string) => {
      const tempToSearch: any[] = this.categoriesAll;
      if (value !== undefined && value !== null && value !== '') {
        // tslint:disable-next-line: max-line-length
        this.categoryContents = tempToSearch.filter((element => {
          ((element.name as string).toLowerCase().includes(value.toLowerCase()))
        }));
      } else {
        this.categoryContents = this.categoriesAll;
      }
    });

    this.isProcessing = true;
    this.fdkApiCalls.getCategories((error, result) => {
      this.isProcessing = false;
      if(result !== null){
        this.categoryContents = result;
        this.categoriesAll = result;
      }
    });

  }
  onCategoryOpen(item) {
    this.isProcessingFolders =true;
    this.categoryFolders = [];
    this.fdkApiCalls.getCategoryFolders(item.id, (error, result) => {
      this.isProcessingFolders =false
      if(result !== null){
        this.categoryFolders = result;
        this.tempCategoryFolders = result;
      }
    })
  }
  viewFolderDetail(id, name) {
    this.router.navigate(['/knowledge-base/solutions/', id, name]);
  }
  onSearch(searchText: string) {
    if (searchText !== '' && searchText !== undefined && searchText !== null) {
      this.categoryFolders = this.tempCategoryFolders.filter(data => (data.name as string).toLowerCase().includes(searchText.toLowerCase()));
    } else {
      this.categoryFolders = this.tempCategoryFolders;
    }
  }
}
