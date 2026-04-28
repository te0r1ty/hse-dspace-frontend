import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription, fromEvent, merge, Observable } from 'rxjs';
import { map, startWith, distinctUntilChanged } from 'rxjs/operators';

import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ds-themed-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html',
  imports: [
    TranslateModule,
    AsyncPipe,
  ],
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent extends BaseComponent implements OnDestroy {
  isMobile$: Observable<boolean>;
  private resizeSubscription: Subscription;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {

    this.isMobile$ = merge(
      fromEvent(window, 'resize').pipe(map(() => window.innerWidth)),
    ).pipe(
      startWith(window.innerWidth),
      map((width: number) => width < 768),
      distinctUntilChanged(),
    );
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}

