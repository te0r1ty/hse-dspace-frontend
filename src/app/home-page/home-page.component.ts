import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';


import { environment } from '../../environments/environment';
import { PaginationService } from '../core/pagination/pagination.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { Site } from '../core/shared/site.model';
import { SortDirection } from '../core/cache/models/sort-options.model';
import { SuggestionsPopupComponent } from '../notifications/suggestions/popup/suggestions-popup.component';
import { ThemedConfigurationSearchPageComponent } from '../search-page/themed-configuration-search-page.component';
import { ThemedSearchFormComponent } from '../shared/search-form/themed-search-form.component';
import { HomeCoarComponent } from './home-coar/home-coar.component';
import { ThemedHomeNewsComponent } from './home-news/themed-home-news.component';
import { RecentItemListComponent } from './recent-item-list/recent-item-list.component';
// import { ThemedTopLevelCommunityListComponent } from './top-level-community-list/themed-top-level-community-list.component';

@Component({
  selector: 'ds-base-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html',
  imports: [
    HomeCoarComponent,
    NgTemplateOutlet,
    RecentItemListComponent,
    SuggestionsPopupComponent,
    ThemedConfigurationSearchPageComponent,
    ThemedHomeNewsComponent,
    ThemedSearchFormComponent,
    // ThemedTopLevelCommunityListComponent,
    TranslateModule,
  ],
})
export class HomePageComponent implements OnInit {

  site$: Observable<Site>;
  recentSubmissionspageSize: number;
  showDiscoverFilters: boolean;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    public searchConfigurationService: SearchConfigurationService,
    protected route: ActivatedRoute,
    private paginationService: PaginationService,
  ) {
    this.recentSubmissionspageSize = this.appConfig.homePage.recentSubmissions.pageSize;
    this.showDiscoverFilters = this.appConfig.homePage.showDiscoverFilters;
  }

  ngOnInit(): void {
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
  }

  onLoadMore(): void {
    this.paginationService.updateRouteWithUrl(this.searchConfigurationService.paginationID, ['search'], {
      sortField: environment.homePage.recentSubmissions.sortField,
      sortDirection: 'DESC' as SortDirection,
    page: 1,
    });
  }
}
