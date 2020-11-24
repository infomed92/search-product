import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    Observable,
    combineLatest,
    Subject
} from 'rxjs';
import { IPlant } from 'app/shared/model/plant.model';
import { IPhase } from 'app/shared/model/phase.model';
import { PlantSwitcherService } from 'app/pmt/shared/service/plant-switcher';
import { PhaseSwitcherService } from 'app/pmt/shared/service/phase-switcher';
import { ProductSwitcherService } from 'app/pmt/shared/service/product-switcher';
import { ProductService, IProduct } from 'app/pmt/shared/entity/search-product';
import { MatDialogRef } from '@angular/material';
import { NomenclatureSwitcherService } from 'app/pmt/shared/service/nomenclature';
import { CostCenterCpSwitcherService } from 'app/pmt/shared/service/cost-center-cp-switcher';
import {
    takeUntil,
    switchMap,
    share
} from 'rxjs/operators';
import { ICostCenterCpByPlantPhase } from 'app/pmt/shared/entity/cost-center/cost-center-cp-by-plant-phase.interface';
import { exists } from 'app/pmt/shared/utils/reactive/reactive.utils';

@Component({
    selector: 'pmt-delete-allocations-switcher-dialog',
    styleUrls: ['delete-allocations-switcher-dialog.component.scss'],
    templateUrl: 'delete-allocations-switcher-dialog.component.html'
})
export class DeleteAllocationsSwitcherDialogComponent implements OnInit, OnDestroy {

    public plant$: Observable<IPlant>;
    public phase$: Observable<IPhase>;
    public product$: Observable<IProduct>;
    public costcenter$: Observable<ICostCenterCpByPlantPhase>;
    public nomenclature$: Observable<string>;
    private destroyed$ = new Subject<boolean>();

    public isLoading = false;
    public error: any;

    constructor(
        private readonly dialogRef: MatDialogRef<any>,
        private readonly plantSwitcherSrv: PlantSwitcherService,
        private readonly phaseSwitcherSrv: PhaseSwitcherService,
        private readonly productSwitcherSrv: ProductSwitcherService,
        private readonly costCenterCpSwitcherSrv: CostCenterCpSwitcherService,
        private readonly nomenclatureSwitcherSrv: NomenclatureSwitcherService,
        private readonly productSrv: ProductService
    ) {}

    public ngOnInit() {
        this.plant$ = this.plantSwitcherSrv.asObservable();
        this.phase$ = this.phaseSwitcherSrv.asObservable();
        this.costcenter$ = this.costCenterCpSwitcherSrv.asObservable();
        this.product$ = this.productSwitcherSrv.asObservable();
        this.nomenclature$ = this.nomenclatureSwitcherSrv.asObservable();
    }

    public onValid(): void {
        this.isLoading = true;
        this.error = undefined;

        const sources$ = combineLatest(
            this.plant$,
            this.phase$,
            this.product$,
            this.costcenter$,
            this.nomenclature$
        ).pipe(
            takeUntil(this.destroyed$),
            exists(5)
        );

        sources$
            .pipe(
                switchMap(([plant, phase, product, costcenter, nomenclature]: [IPlant, IPhase, IProduct, ICostCenterCpByPlantPhase, string]) => {
                    return this.productSrv.queryDeleteAllocations(plant, phase, product, costcenter, nomenclature);
                }),
                share()
            )
            .subscribe(data => {
                this.isLoading = false;
                this.dialogRef.close(data);
            }, err => {
                this.isLoading = false;
                this.error = err.error;
            });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
