import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { SearchFormComponent as BaseComponent } from '../../../../../app/shared/search-form/search-form.component';
import { BrowserOnlyPipe } from '../../../../../app/shared/utils/browser-only.pipe';

@Component({
  selector: 'ds-themed-search-form',
  styleUrls: ['./search-form.component.scss'],
  // styleUrls: ['../../../../../app/shared/search-form/search-form.component.scss'],
  templateUrl: './search-form.component.html',
  // templateUrl: '../../../../../app/shared/search-form/search-form.component.html',
  imports: [
    AsyncPipe,
    BrowserOnlyPipe,
    FormsModule,
    NgbTooltipModule,
    TranslateModule,
  ],
})
export class SearchFormComponent extends BaseComponent {
  isMobile$: Observable<boolean>;

  ngOnInit(): void {
    this.isMobile$ = merge(
          fromEvent(window, 'resize').pipe(map(() => window.innerWidth)),
        ).pipe(
          startWith(window.innerWidth),
          map((width: number) => width < 768),
          distinctUntilChanged(),
        );
  }
}
