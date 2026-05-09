import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AbstractMenuProvider, PartialMenuSection } from '../menu-provider.model';
import { MenuItemType } from '../menu-item-type.model';

/**
 * Menu provider to create the "About" menu section in the public navbar.
 */
@Injectable()
export class AboutMenuProvider extends AbstractMenuProvider {
  constructor() {
    super();
  }

  getSections(): Observable<PartialMenuSection[]> {
    return of([
      {
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.about',
          link: '/about',
        },
      },
    ]);
  }
}
