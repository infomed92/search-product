import { Component, OnInit, OnDestroy, ViewChild, Input, AfterViewInit } from '@angular/core';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { IPlant } from 'app/shared/model/plant.model';
import { IProductGrid } from '../../shared/nomenclature-tab';
import { ExcelExportProperties } from '@syncfusion/ej2-grids';
import {
    GridComponent,
    ToolbarItems,
    PageSettingsModel,
    FilterSettingsModel
} from '@syncfusion/ej2-angular-grids';
import { ProductService, IProduct } from 'app/pmt/shared/entity/search-product';
import { MatSnackBar } from '@angular/material';
import { Tooltip } from '@syncfusion/ej2-popups';
import { filter, takeUntil, switchMap, share } from 'rxjs/operators';
import { buildLoader } from 'app/pmt/shared/utils/loading';
import * as moment from 'moment';
import { PlantSwitcherService } from 'app/pmt/shared/service/plant-switcher';
import { ProductSwitcherService } from 'app/pmt/shared/service/product-switcher';
import { IPhase } from 'app/shared/model/phase.model';
import { PhaseSwitcherService } from 'app/pmt/shared/service/phase-switcher';

@Component({
    selector: 'pmt-grid-nomenclature',
    styleUrls: ['grid-nomenclature.component.scss'],
    templateUrl: 'grid-nomenclature.component.html'
})

export class GridNomenclatureComponent implements OnInit, OnDestroy, AfterViewInit {

    public plant$: Observable<IPlant>;
    public phase$: Observable<IPhase>;
    public product$: Observable<IProduct>;
    public date$: BehaviorSubject<moment.Moment> = new BehaviorSubject<moment.Moment>(moment());
    public depth$: BehaviorSubject<number> = new BehaviorSubject<number>(100);

    public result$: Observable<IProductGrid[]>;
    private destroyed$ = new Subject<boolean>();
    public loading$: Observable<boolean>;
    public error: any;

    private plant: string;
    private phase: string;

    public DATA_GRID: IProductGrid[];

    @ViewChild('grid')
    public gridObj: GridComponent;
    public toolbarOptions: ToolbarItems[];

    public pageSettings: PageSettingsModel;
    public filterSettings: FilterSettingsModel;

    @Input()
    public allocationUnit: string;
    constructor(
        private readonly productSrv: ProductService,
        private readonly plantSwitcherSrv: PlantSwitcherService,
        private readonly phaseSwitcherSrv: PhaseSwitcherService,
        private readonly productSwitcherSrv: ProductSwitcherService,
        private readonly snackBar: MatSnackBar
    ) { }

    public ngOnInit(): void {

        this.plant$ = this.plantSwitcherSrv.asObservable();
        this.phase$ = this.phaseSwitcherSrv.asObservable();
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
                    const validityDate = moment.utc([
                        date.year(),
                        date.month() + 1,
                        date.date()
                    ].join('/'), 'YYYY/MM/DD').toISOString();
                    return this.productSrv.queryNomenclatureGrid(plant, product, validityDate, depth);
                }),
                share()
            );

        this.result$
            .subscribe(
                res => {
                    if (!!res) {
                        this.DATA_GRID = [...res];
                    }
                },
                err => {
                    this.error = err.error;
                    this.openSnackBar(err.error.title, 'Dismiss');
                });

        this.loading$ = buildLoader(source$, this.result$);

        this.pageSettings = { currentPage: 1, pageSize: 5, pageSizes: true, pageCount: 4 };
        this.filterSettings = { type: 'Menu' };
        this.toolbarOptions = ['ExcelExport'];

        this.plant$.subscribe(
            plant => this.plant = !!plant ? plant.plantId.toString() : undefined
        );
        this.phase$.subscribe(
            phase => this.phase = !!phase ? phase.name.toString() : undefined
        );

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
        if (!!args.cell.column.field) {
            const toolcontent = args.cell.column.headerText;
            const tooltip: Tooltip = new Tooltip({
                content: toolcontent
            });
            tooltip.appendTo(args.node);
        }
    }

    public toolbarClick(args: Object): void {
        if (args['item'].text === 'Excel Export') {
            const excelExportProperties: ExcelExportProperties = {
                fileName: `PMT_Nomenclature_${this.plant}_${this.phase}.xlsx`
            };
            this.gridObj.excelExport(excelExportProperties);
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

    public ngAfterViewInit() {
        this.pageSettings = { currentPage: 1, pageSize: 5, pageSizes: true, pageCount: 4 };
    }
}
