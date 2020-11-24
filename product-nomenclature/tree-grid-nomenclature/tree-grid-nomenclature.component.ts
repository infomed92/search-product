import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { IPlant } from 'app/shared/model/plant.model';
import { IProductTreeGrid } from '../../shared/nomenclature-tab';
import {
    TreeGridComponent,
    ToolbarItems,
    PageSettingsModel,
    FilterSettingsModel
} from '@syncfusion/ej2-angular-treegrid';
import { ProductService, IProduct } from 'app/pmt/shared/entity/search-product';
import { MatSnackBar } from '@angular/material';
import { Tooltip } from '@syncfusion/ej2-popups';
import { filter, takeUntil, switchMap, share } from 'rxjs/operators';
import { buildLoader } from 'app/pmt/shared/utils/loading';
import * as moment from 'moment';
import { PlantSwitcherService } from 'app/pmt/shared/service/plant-switcher';
import { ProductSwitcherService } from 'app/pmt/shared/service/product-switcher';

@Component({
    selector: 'pmt-tree-grid-nomenclature',
    styleUrls: ['tree-grid-nomenclature.component.scss'],
    templateUrl: 'tree-grid-nomenclature.component.html'
})
export class TreeGridNomenclatureComponent implements OnInit, OnDestroy {

    public plant$: Observable<IPlant>;
    public product$: Observable<IProduct>;
    public date$: BehaviorSubject<moment.Moment> = new BehaviorSubject<moment.Moment>(moment());
    public depth$: BehaviorSubject<number> = new BehaviorSubject<number>(100);

    public result$: Observable<IProductTreeGrid[]>;
    private destroyed$ = new Subject<boolean>();
    public loading$: Observable<boolean>;
    public error: any;

    public DATA_TREE_GRID: IProductTreeGrid[];
    public initial = true;

    @ViewChild('treegrid')
    public treeGridObj: TreeGridComponent;
    public toolbarOptions: ToolbarItems[];

    public pageSettings: PageSettingsModel;
    public filterSettings: FilterSettingsModel;

    @Input()
    public allocationUnit: string;

    constructor(
        private readonly productSrv: ProductService,
        private readonly plantSwitcherSrv: PlantSwitcherService,
        private readonly productSwitcherSrv: ProductSwitcherService,
        private readonly snackBar: MatSnackBar
    ) {}

    public ngOnInit(): void {

        this.plant$ = this.plantSwitcherSrv.asObservable();
        this.product$ = this.productSwitcherSrv.asObservable();

        const source$ = combineLatest(
            this.plant$,
            this.product$,
            this.date$,
            this.depth$
        ).pipe(
            takeUntil(this.destroyed$),
            filter(([plant, product, date, depth]: [IPlant, IProduct, moment.Moment, number]) => !!plant && !!product && !!date && !!depth)
        );

        this.result$ = source$
            .pipe(
                switchMap(([plant, product, date, depth]: [IPlant, IProduct, moment.Moment, number]) => {
                    const validityDate =  moment.utc([
                        date.year(),
                        date.month() + 1,
                        date.date()
                    ].join('/'), 'YYYY/MM/DD').toISOString();
                    return this.productSrv.queryNomenclatureTreeGrid(plant, product, validityDate, depth);
                }),
                share()
            );

        this.result$
            .subscribe(
                res => {
                    if (!!res) {
                        this.DATA_TREE_GRID = res;
                    }
                },
                err => {
                    this.error = err.error;
                    this.openSnackBar(err.error.title, 'Dismiss');
                });

        this.loading$ = buildLoader(source$, this.result$);

        this.pageSettings = { pageSize: 5, pageSizes: true, pageCount: 4 };
        this.filterSettings = { type: 'Menu' };
        this.toolbarOptions = ['CollapseAll', 'ExpandAll'];

    }

    public openSnackBar(message: string, action: string): void {
        this.snackBar.open(message, action, {
            duration: 3000,
        });
    }

    /**
     * Method to add header column tooltip
     * @param args
     */
    public headerCellInfo(args) {
        if ( !!args.cell.column.field ) {
            const toolcontent = args.cell.column.headerText;
            const tooltip: Tooltip = new Tooltip({
                content: toolcontent
            });
            tooltip.appendTo(args.node);
        }
    }

    public toolbarClick(args: Object): void {
        if (args['item'].text === 'Expand All') {
            this.treeGridObj.expandAtLevel(0);
        } else if (args['item'].text === 'Collapse All') {
            this.treeGridObj.collapseAtLevel(0);
        }
    }

    public dataBound(): void {
        if (this.initial === true) {
            this.treeGridObj.expandAtLevel(0);
            this.initial = false;
        }
    }

    public formatNumber(nb: number): number {
        return !!nb ? +nb.toFixed(6) : null;
    }

    public convertToMin(value: number): number {
        if (value === null || value === undefined) {
            return null;
        } else if (!!value || value === 0) {
            if (value === 0) {
                return 0;
            }
            value = +(value * 60).toFixed(6);
        }
        return value;
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
