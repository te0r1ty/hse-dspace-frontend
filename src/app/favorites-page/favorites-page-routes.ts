import { Route } from '@angular/router';

import { FavoritesPageComponent } from './favorites-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    data: {
      title: 'favorites.title',
    },
    children: [
      {
        path: '',
        component: FavoritesPageComponent,
      },
    ],
  },
];
