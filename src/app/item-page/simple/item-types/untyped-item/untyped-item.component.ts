import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, fromEvent, merge } from 'rxjs';
import { map, startWith, distinctUntilChanged, take } from 'rxjs/operators';

import { environment } from '../../../../../environments/environment';
import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { RouteService } from '../../../../core/services/route.service';
import { DsoEditMenuComponent } from '../../../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { DspaceRestService } from '../../../../core/dspace-rest/dspace-rest.service';
import { RestRequestMethod } from '../../../../core/data/rest-request-method';
// import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ThemedResultsBackButtonComponent } from '../../../../shared/results-back-button/themed-results-back-button.component';
// import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { CollectionsComponent } from '../../../field-components/collections/collections.component';
// import { ThemedMediaViewerComponent } from '../../../media-viewer/themed-media-viewer.component';
import { MiradorViewerComponent } from '../../../mirador-viewer/mirador-viewer.component';
import { ThemedFileSectionComponent } from '../../field-components/file-section/themed-file-section.component';
import { ItemPageAbstractFieldComponent } from '../../field-components/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageCcLicenseFieldComponent } from '../../field-components/specific-field/cc-license/item-page-cc-license-field.component';
import { ItemPageDateFieldComponent } from '../../field-components/specific-field/date/item-page-date-field.component';
import { GenericItemPageFieldComponent } from '../../field-components/specific-field/generic/generic-item-page-field.component';
import { GeospatialItemPageFieldComponent } from '../../field-components/specific-field/geospatial/geospatial-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../../field-components/specific-field/title/themed-item-page-field.component';
import { ItemPageUriFieldComponent } from '../../field-components/specific-field/uri/item-page-uri-field.component';
import { ThemedMetadataRepresentationListComponent } from '../../metadata-representation-list/themed-metadata-representation-list.component';
import { ItemComponent } from '../shared/item.component';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    CollectionsComponent,
    DsoEditMenuComponent,
    GenericItemPageFieldComponent,
    GeospatialItemPageFieldComponent,
    ItemPageAbstractFieldComponent,
    ItemPageCcLicenseFieldComponent,
    ItemPageDateFieldComponent,
    ItemPageUriFieldComponent,
    // MetadataFieldWrapperComponent,
    MiradorViewerComponent,
    RouterLink,
    ThemedFileSectionComponent,
    ThemedItemPageTitleFieldComponent,
    // ThemedMediaViewerComponent,
    ThemedMetadataRepresentationListComponent,
    ThemedResultsBackButtonComponent,
    // ThemedThumbnailComponent,
    TranslateModule,
  ],
})
export class UntypedItemComponent extends ItemComponent implements OnInit, OnChanges {
  isMobile$: Observable<boolean>;
  isAuthenticated$: Observable<boolean>;
  isFavorited = false;

  constructor(
    protected routeService: RouteService,
    protected router: Router,
    protected authService: AuthService,
    protected restService: DspaceRestService,
  ) {
    super(routeService, router);

    this.isAuthenticated$ = this.authService.isAuthenticated();

    this.isMobile$ = merge(
      fromEvent(window, 'resize').pipe(map(() => window.innerWidth)),
    ).pipe(
      startWith(window.innerWidth),
      map((width: number) => width < 768),
      distinctUntilChanged(),
    );
  }


  ngOnInit(): void {
    super.ngOnInit();
    this.loadFavoriteStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.object && this.object?.id) {
      this.loadFavoriteStatus();
    }
  }

  private loadFavoriteStatus(): void {
    if (!this.object?.id) {
      return;
    }

    this.authService.getAuthenticatedUserIdFromStore().pipe(
      take(1),
    ).subscribe((userId: string) => {
      if (!userId) {
        this.isFavorited = false;
        return;
      }

      const favoritesUrl = `${environment.rest.baseUrl}/api/favorites`;
      const body = {
        userID: userId,
        projectID: this.object.id,
      };
      const options = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }),
        withCredentials: true,
      };

      this.restService.request(
        RestRequestMethod.GET,
        favoritesUrl,
        body,
        options,
      ).subscribe({
        next: (response) => {
          const payload = response?.payload as unknown;
          this.isFavorited = payload === true;
        },
        error: (error) => {
          console.error('Error checking favorite status', error);
          this.isFavorited = false;
        },
      });
    });
  }

  addProjectToFavorites(): void {
    this.authService.getAuthenticatedUserIdFromStore().pipe(
      take(1),
    ).subscribe((userId: string) => {
      if (userId && this.object?.id) {
        const body = {
          userID: userId,
          projectID: this.object.id,
        };
        const options = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }),
          withCredentials: true,
        };
        const favoritesUrl = `${environment.rest.baseUrl}/api/favorites`;

        this.restService.request(
          RestRequestMethod.PUT,
          favoritesUrl,
          body,
          options,
        ).subscribe({
          next: () => {
            console.log('Project added to favorites');
            this.loadFavoriteStatus();
          },
          error: (error) => {
            console.error('Error adding favorite project', error);
          },
        });
      } else {
        this.authService.redirectToLogin();
      }
    });
  }

  redirectToLogin(): void {
    this.authService.redirectToLogin();
  }
}
