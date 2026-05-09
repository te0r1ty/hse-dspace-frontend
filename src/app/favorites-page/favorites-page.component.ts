import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, switchMap, take } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';
import { DspaceRestService } from '../core/dspace-rest/dspace-rest.service';
import { environment } from '../../environments/environment';
import { ThemedLoadingComponent } from '../shared/loading/themed-loading.component';

@Component({
  selector: 'ds-favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.scss'],
  imports: [AsyncPipe, ThemedLoadingComponent, TranslateModule],
})
export class FavoritesPageComponent implements OnInit {

  public favorites$ = new BehaviorSubject<any[]>([]);
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
        const favoritesUrl = `${environment.rest.baseUrl}/api/favorites?userId=${ePerson?.id}`;
        return this.restService.get(favoritesUrl);
      }),
    ).subscribe({
      next: (response) => {
        const payload = response?.payload;
        this.favorites$.next(Array.isArray(payload) ? payload : []);
        this.loading$.next(false);
      },
      error: () => {
        this.favorites$.next([]);
        this.loading$.next(false);
      },
    });
  }

  public getLabel(favorite: any): string {
    return favorite?.projectName || favorite?.projectTitle || favorite?.name || favorite?.title || favorite?.id || JSON.stringify(favorite);
  }
}
