import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, switchMap, take } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';
import { DspaceRestService } from '../core/dspace-rest/dspace-rest.service';
import { environment } from '../../environments/environment';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';

export interface FavoriteProject {
  title: string;
  uri: string;
}

@Component({
  selector: 'ds-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.scss'],
  imports: [AsyncPipe, ThemedLoadingComponent, TranslateModule],
})
export class FavoritesPageComponent implements OnInit {

  public favorites$ = new BehaviorSubject<FavoriteProject[]>([]);
  public loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private restService: DspaceRestService,
  ) {}

  ngOnInit(): void {
    this.retrieveFavorites();
  }

  private retrieveFavorites(): void {
    this.authService.getAuthenticatedUserFromStore().pipe(
      take(1),
      switchMap((ePerson) => {
        this.loading$.next(true);
        const favoritesUrl = `${environment.rest.baseUrl}/api/favorites/items?userID=${ePerson?.id}`;
        return this.restService.get(favoritesUrl);
      }),
    ).subscribe({
      next: (response) => {
        const payload = response?.payload;
        this.favorites$.next(this.parseFavorites(payload));
        this.loading$.next(false);
      },
      error: () => {
        this.favorites$.next([]);
        this.loading$.next(false);
      },
    });
  }

  private parseFavorites(payload: unknown): FavoriteProject[] {
    if (!Array.isArray(payload)) {
      return [];
    }

    return payload.map((item) => {
      const favorite = item as Record<string, unknown>;
      const title = typeof favorite.title === 'string' ? favorite.title : '';
      const uri = typeof favorite.uri === 'string' ? favorite.uri : '';

      return { title, uri };
    }).filter((favorite) => favorite.title.length > 0 && favorite.uri.length > 0);
  }

  public getLabel(favorite: FavoriteProject): string {
    return favorite.title;
  }

  public getUrl(favorite: FavoriteProject): string {
    return favorite.uri;
  }
}
