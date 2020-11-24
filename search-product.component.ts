import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { IPlant } from '../../shared/model/plant.model';
import {
    BehaviorSubject,
    Observable,
    combineLatest,
    merge,
    of,
    Subject
} from 'rxjs';
import {
    switchMap,
    filter,
    debounceTime,
    share,
    scan,
    pluck,
    withLatestFrom,
    mapTo,
    map,
    startWith,
    takeUntil
} from 'rxjs/operators';
import { IProduct,
         ProductService,
         IResultWithPagination
} from '../shared/entity/search-product';
import {
    PlantSwitcherService
} from '../shared/service/plant-switcher/plant-switcher.service';
import { buildLoader } from '../shared/utils/loading';
import { IPhase } from 'app/shared/model/phase.model';
import { PhaseSwitcherService } from '../shared/service/phase-switcher';
import { MatSnackBar } from '@angular/material';
import { exists } from '../shared/utils/reactive/reactive.utils';
import { TextFilterSavedSwitcherService } from '../shared/service/text-filter-saved';
import { ReturnToSearchProductSwitcherService } from './shared/return-to-search-product-switcher.service';
import { ReturnToPalmaHomeListProductSwitcherService } from './shared/return-to-palma-home-list-product-switcher.service';

@Component({
    selector: 'pmt-search-product',
    styleUrls: ['./search-product.component.scss'],
    templateUrl: './search-product.component.html'
})
export class SearchProductComponent implements OnInit, OnDestroy {

    public plant$: Observable<IPlant>;
    public phase$: Observable<IPhase>;
    public textFilter$: BehaviorSubject<string> = new BehaviorSubject(undefined);
    public products$: Observable<IProduct[]>;
    public page$: BehaviorSubject<number> = new BehaviorSubject(0);
    public result$: Observable<IResultWithPagination<IProduct>>;
    public loading$: Observable<boolean>;
    public isSeeMoreAvailable$: Observable<boolean>;
    private destroyed$ = new Subject<boolean>();

    constructor(
        private readonly plantSwitcherSrv: PlantSwitcherService,
        private readonly phaseSwitcherSrv: PhaseSwitcherService,
        private readonly textFilterSavedSwitcherSrv: TextFilterSavedSwitcherService,
        private readonly returnToSearchProductSwitcherSrv: ReturnToSearchProductSwitcherService,
        private readonly returnToPalmaHomeListProductSwitcherSrv: ReturnToPalmaHomeListProductSwitcherService,
        private readonly productSrv: ProductService,
        private readonly _snackBar: MatSnackBar,
        private readonly router: Router
    ) {}

    public ngOnInit() {
        this.plant$ = this.plantSwitcherSrv.asObservable();
        this.phase$ = this.phaseSwitcherSrv.asObservable();

        this.textFilter$.next(!!this.textFilterSavedSwitcherSrv.getValue() ? this.textFilterSavedSwitcherSrv.getValue() : null);

        const source$ = combineLatest(
            this.plant$,
            this.phase$,
            this.textFilter$,
            this.page$
        ).pipe(
            exists(3)
        );

        this.result$ = source$
            .pipe(
                takeUntil(this.destroyed$),
                debounceTime(600),
                withLatestFrom(this.textFilter$),
                switchMap(([[plant, phase, q, page], qCurrent]:
                           [[IPlant, IPhase, string, number], string]) => {
                    if (!!qCurrent) {
                        this.textFilterSavedSwitcherSrv.next(q);
                        this.returnToSearchProductSwitcherSrv.next(false);
                        this.returnToPalmaHomeListProductSwitcherSrv.next(false);
                        return this.productSrv.query(plant, phase, q, page, 12);
                    } else {
                        return of({});
                    }
                }),
                share()
            );

        this.products$ = merge(
                this.result$,
                this.textFilter$.pipe(mapTo({}))
            )
            .pipe(
                scan((acc: IProduct[], value: IResultWithPagination<IProduct>) => {
                    return value.results === undefined ? [] : [...acc, ...value.results];
                }, [])
            );

        this.result$
            .pipe(
                pluck('results'),
                filter((array: IProduct[]) => array && array.length === 0)
            )
            .subscribe(() => {
                this.openSnackBar('No result found !', 'Dismiss');
            });

        this.textFilter$
            .pipe(
                debounceTime(100)
            )
            .subscribe(() => {
                this.page$.next(0);
            });

        this.loading$ = buildLoader(source$, this.result$);

        this.isSeeMoreAvailable$ = combineLatest(this.result$, this.products$)
            .pipe(
                map(([res, products]: [IResultWithPagination<IProduct>, IProduct[]]) => {
                    return (res.page + 1 < res.total) && !!products.length;
                }),
                startWith(false)
            );

        this.router.navigate([
            {
                outlets: {
                    header: 'palma-plant-phase'
                }
            }
        ],
        {
            replaceUrl: true
        });

    }

    public openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 3000,
        });
    }

    public seeMore() {
        this.page$.next(this.page$.getValue() + 1);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
