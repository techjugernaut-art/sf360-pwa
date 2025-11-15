import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { FdkApiCallsService } from 'src/app/services/network-calls/fdk-api-calls.service';

@Component({
  selector: 'app-freshdesk-article-list',
  templateUrl: './freshdesk-article-list.component.html'
})
export class FreshdeskArticleListComponent implements OnInit {

  isProcessing = false;
  folderId: any;
  folderName;
  articles: any;
  pageHeaderOptions: IPageHeader;

  constructor(
    private fdkApiCalls: FdkApiCallsService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.folderId = this.route.snapshot.params['id'];
    this.folderName = this.route.snapshot.params['name'];
    this.pageHeaderOptions = { pageTitle: this.folderName, hideFilterPanel: true };

    if (this.folderId !== null) {
      this.isProcessing = true;
      this.fdkApiCalls.getFolderArticles(this.folderId, (error, result) => {
        this.isProcessing = false;
        if(result !== null){
          this.articles = result
        }
      })
    }
  }
  goBack() {
    this.router.navigate(['/knowledge-base'])
  }
  viewArticleDetail(id, title) {
    this.router.navigate(['/knowledge-base/articles/', id, title]);
  }
}