import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProductService, IProduct } from '../../shared/entity/search-product';
import { Observable, combineLatest, Subject, BehaviorSubject } from 'rxjs';
import { PlantSwitcherService } from '../../shared/service/plant-switcher';
import { PhaseSwitcherService } from '../../shared/service/phase-switcher';
import { IPlant } from 'app/shared/model/plant.model';
import { IPhase } from 'app/shared/model/phase.model';
import { MatTableDataSource } from '@angular/material/table';
import { exist } from '../../shared/utils/reactive/reactive.utils';
import { MatDialog, MatTabChangeEvent, MatSnackBar } from '@angular/material';
import { ProductSwitcherService } from 'app/pmt/shared/service/product-switcher/product-switcher.service';
import {
    filter,
    switchMap,
    share,
    withLatestFrom,
    takeUntil,
    map
} from 'rxjs/operators';
import { buildLoader } from '../../shared/utils/loading';
import { IResultProductGammes, IProductGammes } from '../shared';
import { CostCenterCpSwitcherDialogComponent } from '../cost-center-cp-switcher-dialog/cost-center-cp-switcher-dialog.component';
import { CostCenterCpSwitcherService } from '../../shared/service/cost-center-cp-switcher/cost-center-cp-switcher.service';
import { ICostCenterCpByPlantPhase } from 'app/pmt/shared/entity/cost-center/cost-center-cp-by-plant-phase.interface';
import { Router } from '@angular/router';
import { AllocationIndicatorSwitcherService } from '../../shared/service/allocation-indicator';
import { IGammeInput } from '../shared/gamme-input.interface';
import { NomenclatureSwitcherService } from 'app/pmt/shared/service/nomenclature/nomenclature-switcher.service';
import { ReturnToSearchProductSwitcherService } from '../shared/return-to-search-product-switcher.service';
import { TabSelectedIndexSwitcherService } from '../shared/tab-selected-index-switcher.service';
import { DeleteAllocationsSwitcherDialogComponent } from '../delete-allocations-switcher-dialog';
import { ReturnToPalmaHomeListProductSwitcherService } from '../shared/return-to-palma-home-list-product-switcher.service';
import { AllocationUnit } from '../shared/allocation-unit.interface';

@Component({
    selector: 'pmt-product-gammes',
    styleUrls: ['./product-gammes.component.scss'],
    templateUrl: './product-gammes.component.html'
})
export class ProductGammesComponent implements OnInit, OnDestroy {

    @ViewChild('tabGroup') tabGroup: ViewChild;
    public tabSelectedIndex$: BehaviorSubject<number> = new BehaviorSubject<number>(undefined);
    public displayedColumns: string[] = ['nomenclature', 'costCenter', 'gm', 'typeUO', 'indicator', 'allocation', 'delete'];
    public resultGammes$: Observable<IResultProductGammes>;
    public product: IProduct;
    public N2_GAMMES = new MatTableDataSource();
    public N1_GAMMES = new MatTableDataSource();
    public plant$: Observable<IPlant>;
    public phase$: Observable<IPhase>;
    public product$: Observable<IProduct>;
    public loading$: Observable<boolean>;
    public costCenter$: Observable<ICostCenterCpByPlantPhase>;
    private destroyed$ = new Subject<boolean>();
    public refreshPage$ = new BehaviorSubject<boolean>(true);

    public nomenclature$: BehaviorSubject<string> = new BehaviorSubject<string>('N2');
    public isNomenclatureTab$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public isBackToPalmaHome$: Observable<boolean>;
    public allocationUnit: string;
    public allocationUnitObj: AllocationUnit;

    constructor(
        private readonly dialog: MatDialog,
        private readonly productSrv: ProductService,
        private readonly costCenterCpSwitcherSrv: CostCenterCpSwitcherService,
        private readonly plantSwitcherSrv: PlantSwitcherService,
        private readonly phaseSwitcherSrv: PhaseSwitcherService,
        private readonly productSwitcherSrv: ProductSwitcherService,
        private readonly router: Router,
        private readonly _snackBar: MatSnackBar,
        private readonly allocationIndicatorSwitcherSrv: AllocationIndicatorSwitcherService,
        private readonly nomenclatureSwitcherSrv: NomenclatureSwitcherService,
        private readonly returnToSearchProductSwitcherSrv: ReturnToSearchProductSwitcherService,
        private readonly returnToPalmaHomeListProductSwitcherSrv: ReturnToPalmaHomeListProductSwitcherService,
        private readonly tabSelectedIndexSwitcherSrv: TabSelectedIndexSwitcherService
    ) { }

    public ngOnInit() {
        this.tabSelectedIndex$.next(this.tabSelectedIndexSwitcherSrv.getValue());
        this.isNomenclatureTab$.next(this.tabSelectedIndex$.getValue() === 2);
        this.plant$ = this.plantSwitcherSrv.asObservable();
        this.phase$ = this.phaseSwitcherSrv.asObservable();
        this.product$ = this.productSwitcherSrv.asObservable();
        this.costCenter$ = this.costCenterCpSwitcherSrv.asObservable();

        const src$ = combineLatest(
            this.plant$,
            this.phase$,
            this.product$,
            this.costCenter$,
            this.refreshPage$
        ).pipe(
            takeUntil(this.destroyed$),
            filter(([plant, phase, product, costCenter, refreshPage]: [IPlant, IPhase, IProduct, ICostCenterCpByPlantPhase, boolean]) => !!plant && !!phase && !!product)
        );

        this.resultGammes$ = src$
            .pipe(
                switchMap(([plant, phase, product, costCenter, refreshPage]: [IPlant, IPhase, IProduct, ICostCenterCpByPlantPhase, boolean]) => {
                    return this.productSrv.querySearchGamme(plant, phase, product);
                }),
                share()
            );

        this.resultGammes$.subscribe(
            res => {
                this.product = res.product;
                this.N2_GAMMES = new MatTableDataSource(res.n2Gammes);
                this.N1_GAMMES = new MatTableDataSource(res.n1Gammes);
            });

        this.loading$ = buildLoader(src$, this.resultGammes$);

        this.isBackToPalmaHome$ = this.returnToPalmaHomeListProductSwitcherSrv.asObservable()
            .pipe(
                map(value => value)
            );

        this.router.navigate([
            {
                outlets: {
                    header: 'palma-plant-phase-disabled'
                }
            }
        ],
            {
                replaceUrl: true
            });
        this.productSrv.queryGetUserPreferences()
            .subscribe(
                (response: AllocationUnit) => {
                    if (response && response.lastChoiceDisplayGamme) {
                        this.allocationUnitObj = response;
                        this.allocationUnit = response.lastChoiceDisplayGamme;
                    }
                },
                error => {
                    console.log();
                });
    }

    public convertToMin(value: any): number {
        if (!!value || value === 0) {
            if (value === 0) {
                return 0;
            }
            value = (value * 60);
            if (value - Math.floor(value) !== 0) {
                value = (value).toFixed(6);
            } else {
                value = (value);
            }
        }
        return value;
    }

    public convertToHrs(value: any): number {
        if (!!value || value === 0) {
            if (value === 0) {
                return 0;
            }
            if (value - Math.floor(value) !== 0 ) {
                value = (value).toFixed(6);
            } else {
                value = (value);
            }
        }
        return value;
    }

    public convertUOType(unit: string, uotype: string): string {
        if (unit === 'MINUTES') {
            uotype = 'MIN';
        } else {
            uotype = 'HRS';
        }
        return uotype;
    }

    public onSelectionAllocationUnit(value: string) {
        this.allocationUnit = value;
        const body = {
            id: this.allocationUnitObj.id,
            lastChoiceDisplayGamme: this.allocationUnit,
        };
        this.productSrv.queryUpdateUserPreference(body)
            .subscribe(
                (response: AllocationUnit) => {
                    if (response) {
                        console.log('success', response);
                    }
                },
                error => {
                    console.log();
                });
    }

    public isRemovableAllocations(element: IProductGammes): boolean {
        let bool = true;
        if (!!element && !!element.gammes) {
            const allocations = element.gammes;
            for (const alloc of allocations) {
                if (alloc.value !== 0) {
                    bool = false;
                    break;
                }
            }
        }
        return bool;
    }

    public applyFilterN2Gammes(filterValue: string) {
        this.N2_GAMMES.filter = filterValue.trim().toLowerCase();
    }

    public applyFilterN1Gammes(filterValue: string) {
        this.N1_GAMMES.filter = filterValue.trim().toLowerCase();
    }

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.nomenclature$.next(tabChangeEvent.index === 0 ? 'N2' : 'N1');
        this.tabSelectedIndexSwitcherSrv.next(tabChangeEvent.index);
        this.isNomenclatureTab$.next(tabChangeEvent.index === 2);
    }

    public openDialogCostCenter(): void {
        const dialogRef = this.dialog.open(CostCenterCpSwitcherDialogComponent, {
            width: '600px',
            height: '300px'
        });

        dialogRef.afterClosed()
            .pipe(
                exist(),
                withLatestFrom(this.plant$, this.phase$, this.product$),
                switchMap(([costCenter, plant, phase, product]: [ICostCenterCpByPlantPhase, IPlant, IPhase, IProduct]) => {
                    const gamme: IGammeInput = {
                        plantId: plant.id,
                        phaseId: phase.id,
                        productId: product.id,
                        costcenterId: costCenter.id,
                        nomenclature: this.nomenclature$.getValue()
                    };
                    return this.productSrv.queryCreateGamme(gamme);
                })
            )
            .subscribe(
                costCenter => {
                    this.costCenterCpSwitcherSrv.next(costCenter);
                },
                err => {
                    this.openSnackBar(err.error.title, 'Dismiss');
                }
            );
    }

    public openSnackBar(message: string, action: string): void {
        this._snackBar.open(message, action, {
            duration: 3000,
        });
    }

    /**
     * Delete Allocation
     * @param element IProductGammes
     */
    public openDialogDeleteAllocations(element: IProductGammes): void {
        const dialogRef = this.dialog.open(DeleteAllocationsSwitcherDialogComponent, {
            width: '550px',
            height: '245px'
        });

        this.costCenterCpSwitcherSrv.next(element.costcenter);
        this.nomenclatureSwitcherSrv.next(element.nomenclature);

        dialogRef.afterClosed()
            .pipe(
                exist(),
                withLatestFrom(this.refreshPage$)
            ).subscribe(() => this.refreshPage$.next(true));
    }

    public goBackToSearchProductOrPalmaHome(): void {
        if (this.returnToPalmaHomeListProductSwitcherSrv.getValue()) {
            this.router.navigate(['/palma-home']);
        } else {
            this.router.navigate(['/search-product']);
            this.returnToSearchProductSwitcherSrv.next(true);
        }
    }

    public goToGammeDetail(gamme: IProductGammes, index: number): void {
        const indicator: string = gamme.indicators[index];
        this.allocationIndicatorSwitcherSrv.next(indicator);
        this.costCenterCpSwitcherSrv.next(gamme.costcenter);
        this.nomenclatureSwitcherSrv.next(gamme.nomenclature);
        this.router.navigate(['/gamme-detail']);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
