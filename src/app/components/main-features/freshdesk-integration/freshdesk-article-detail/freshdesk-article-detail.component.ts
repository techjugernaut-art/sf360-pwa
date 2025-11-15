import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { IPageHeader } from 'src/app/interfaces/page-heading.interface';
import { FdkApiCallsService } from 'src/app/services/network-calls/fdk-api-calls.service';

@Component({
  selector: 'app-freshdesk-article-detail',
  templateUrl: './freshdesk-article-detail.component.html'
})
export class FreshdeskArticleDetailComponent implements OnInit {
  isProcessing = false;
  id: any;
  articleDetail: any;
  pageHeaderOptions: IPageHeader;
  pageTitle: '';

  constructor(
    private fdkApiCalls: FdkApiCallsService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.pageTitle = this.route.snapshot.params['title'];
    this.pageHeaderOptions = { pageTitle: this.pageTitle, hideFilterPanel: true };

    if (this.id !== null) {
      this.isProcessing=true;
      this.fdkApiCalls.getArticle(this.id, (error, result) => {
        this.isProcessing=false;
        if(result !== null){
          // console.log(result)
          this.articleDetail = result;
        }
      })
    }

  }
  goBack() {
    this.router.navigate(['/knowledge-base'])
  }

}
