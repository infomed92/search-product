import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService, IProduct } from '../../shared/entity/search-product';
import { CostCenterCpSwitcherService } from '../../shared/service/cost-center-cp-switcher/cost-center-cp-switcher.service';
import {
    Observable,
    combineLatest,
    Subject,
    BehaviorSubject
} from 'rxjs';
import { AllocationIndicatorSwitcherService } from '../../shared/service/allocation-indicator';
import {
    switchMap,
    share,
    takeUntil,
    withLatestFrom
} from 'rxjs/operators';
import { buildLoader } from '../../shared/utils/loading';
import { IGammeGant } from '../shared/gamme-gant.interface';
import { Router } from '@angular/router';
import { IPlant } from '../../../shared/model/plant.model';
import { IPhase } from '../../../shared/model/phase.model';
import { ICostCenterCpByPlantPhase } from '../../shared/entity/cost-center/cost-center-cp-by-plant-phase.interface';
import { ProductSwitcherService } from '../../shared/service/product-switcher/product-switcher.service';
import { PlantSwitcherService } from '../../shared/service/plant-switcher';
import { PhaseSwitcherService } from '../../shared/service/phase-switcher';
import { MatDialog } from '@angular/material';
import { CreateAllocationSwitcherDialogComponent } from '../create-allocation-switcher-dialog';
import * as moment from 'moment';
import { NomenclatureSwitcherService } from 'app/pmt/shared/service/nomenclature';
import {
    exist,
    exists
} from 'app/pmt/shared/utils/reactive/reactive.utils';
import { EditAllocationSwitcherDialogComponent } from '../edit-allocation-switcher-dialog';
import { AllocationTemplateSwitcherService } from '../shared';
import { IAllocationTemplate } from '../shared/allocation-template.interface';
import { AccountService } from 'app/core';
import { hasPalmaAccessToPlant, isAdmin } from 'app/pmt/shared/utils/auth';
import { AllocationUnit } from '../shared/allocation-unit.interface';

@Component({
    selector: 'pmt-gamme-detail',
    styleUrls: ['gamme-detail.component.scss'],
    templateUrl: 'gamme-detail.component.html'
})
export class GammeDetailComponent implements OnInit, OnDestroy {

    public plant$: Observable<IPlant>;
    public phase$: Observable<IPhase>;
    private plant_: IPlant;
    private auths_: string[];
    public product$: Observable<IProduct>;
    public costCenter$: Observable<ICostCenterCpByPlantPhase>;
    public allocationIndicator$: Observable<string>;
    public nomenclature$: Observable<string>;
    public resultGammesGant$: Observable<IGammeGant[]>;
    public resGammesGant: IGammeGant[];
    public loading$: Observable<boolean>;
    private destroyed$ = new Subject<boolean>();
    public refreshPage$ = new BehaviorSubject<boolean>(true);
    public hideUserInfos: boolean[] = new Array(1100).fill(true);

    public year = {
        lastYear: moment().subtract(1, 'year').year(),
        currentYear: moment().year(),
        nextYear: moment().add(1, 'year').year()
    };
    public allocationUnit: string;
    public allocationUnitObj: AllocationUnit;

    constructor(
        private readonly productSrv: ProductService,
        private readonly costCenterCpSwitcherSrv: CostCenterCpSwitcherService,
        private readonly plantSwitcherSrv: PlantSwitcherService,
        private readonly phaseSwitcherSrv: PhaseSwitcherService,
        private readonly productSwitcherSrv: ProductSwitcherService,
        private readonly allocationIndicatorSwitcherSrv: AllocationIndicatorSwitcherService,
        private readonly nomenclatureSwitcherSrv: NomenclatureSwitcherService,
        private readonly allocationTemplateSwitcherSrv: AllocationTemplateSwitcherService,
        private readonly accountSrv: AccountService,
        private readonly router: Router,
        private readonly dialog: MatDialog,
    ) { }

    public ngOnInit() {
        this.plant$ = this.plantSwitcherSrv.asObservable();
        this.phase$ = this.phaseSwitcherSrv.asObservable();
        this.product$ = this.productSwitcherSrv.asObservable();
        this.costCenter$ = this.costCenterCpSwitcherSrv.asObservable();
        this.allocationIndicator$ = this.allocationIndicatorSwitcherSrv.asObservable();
        this.nomenclature$ = this.nomenclatureSwitcherSrv.asObservable();

        const srce$ = combineLatest(
            this.plant$,
            this.phase$,
            this.product$,
            this.costCenter$,
            this.allocationIndicator$,
            this.nomenclature$,
            this.refreshPage$
        ).pipe(
            takeUntil(this.destroyed$),
            exists(6)
        );

        this.resultGammesGant$ = srce$
            .pipe(
                switchMap(([plant, phase, product, costCenter, allocationIndicator, nomenclature, refreshPage]
                    : [IPlant, IPhase, IProduct, ICostCenterCpByPlantPhase, string, string, boolean]) => {
                    return this.productSrv.querySearchAllGammes(plant, phase, product, costCenter, allocationIndicator, nomenclature);
                }),
                share()
            );

        this.resultGammesGant$.subscribe(
            res => {
                this.resGammesGant = res;
            });

        this.loading$ = buildLoader(srce$, this.resultGammesGant$);

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
                    console.log('Error something went wrong');
                });

    }

    /**
     * Method to calcul the transformation to apply on each Gant's dodded line.
     * @param gamme The current gamme
     * @return A translation as string
     */
    public getTransformDoddedLine(gamme: IGammeGant): string {
        let valueX = -295;
        const valueY = 0;
        const startDate = moment.utc(gamme.validityStart);
        const gammeYear = startDate.year();
        const dayOfYearStart = moment(startDate).dayOfYear();
        if (gammeYear === this.year.lastYear) {
            valueX = -295 + dayOfYearStart * 0.5;
        } else if (gammeYear === this.year.currentYear) {
            valueX = -115 + dayOfYearStart * 0.5;
        } else if (gammeYear === this.year.nextYear) {
            valueX = 65 + dayOfYearStart * 0.5;
        }

        return `translate(${valueX}, ${valueY})`;
    }

    /**
     * Method to calcul the height to apply on each Gant's dodded line.
     * @param gamme The index of gamme
     * @return A y2 value as string
     */
    public getLineY2Value(res: IGammeGant[]): string {
        let Y2 = 140;
        let gammesNb = res.length;
        if (gammesNb === 1) {
            gammesNb = 0;
        }
        Y2 += gammesNb * 60;

        return `${Y2}`;
    }

    /**
     * Method to calcul the transformation to apply on each Gant's yellow rectangle.
     * @param gamme The current gamme
     * @return A translation as string
     */
    public getTransformYellowRect(gamme: IGammeGant, index: number): string {
        let valueX = 6;
        let valueY = 65;
        const startDate = moment.utc(gamme.validityStart);
        const gammeYear = startDate.year();
        const dayOfYearStart = moment(startDate).dayOfYear();
        if (gammeYear === this.year.lastYear) {
            valueX = 6 + dayOfYearStart * 0.5;
        } else if (gammeYear === this.year.currentYear) {
            valueX = 186 + dayOfYearStart * 0.5;
        } else if (gammeYear === this.year.nextYear) {
            valueX = 366 + dayOfYearStart * 0.5;
        }

        valueY += index * 60;

        return `translate(${valueX}, ${valueY})`;
    }

    /**
     * Method to calcul the width to apply on each Gant's yellow rectangle.
     * @param gamme The current gamme
     * @return A width as string
     */
    public getWidthRect(index: number, gamme: IGammeGant, res: IGammeGant[]): string {
        let width = 176;
        const widthMax = 510;
        const startDate = moment.utc(gamme.validityStart);
        const gammeYearStart = startDate.year();
        const dayOfYearStart = moment(startDate).dayOfYear();

        let idxStart = 0;
        if (gammeYearStart === this.year.lastYear) {
            idxStart = 0;
        } else if (gammeYearStart === this.year.currentYear) {
            idxStart = 1;
        } else if (gammeYearStart === this.year.nextYear) {
            idxStart = 2;
        }

        let idxEnd = 0;

        let dayOfYearEnd = 1;
        let ratio = 0;

        if (index === 0) {
            dayOfYearEnd = 365;
            idxEnd = 2;

        } else {
            const nextGamme = res[index - 1];
            const startDateNextGamme = moment.utc(nextGamme.validityStart);
            const endDate = startDateNextGamme;
            const gammeYearEnd = endDate.year();
            dayOfYearEnd = moment(endDate).dayOfYear();

            if (gammeYearEnd === this.year.lastYear) {
                idxEnd = 0;
            } else if (gammeYearEnd === this.year.currentYear) {
                idxEnd = 1;
            } else if (gammeYearEnd === this.year.nextYear) {
                idxEnd = 2;
            }
        }

        ratio = ((dayOfYearEnd + (idxEnd * 365)) - (dayOfYearStart + (idxStart * 365))) / (365 * 3);
        width = ratio * widthMax;

        return `${width}`;
    }

    /**
     * Method to calcul the transformation to apply on each Gant's plus minus icon.
     * @param gamme The current gamme
     * @return A translation as string
     */
    public getTransformPlusMinusIcon(gamme: IGammeGant, res: IGammeGant[]): string {
        let valueX = -6;
        let valueY = 140;
        const startDate = moment.utc(gamme.validityStart);
        const gammeYear = startDate.year();
        const dayOfYearStart = moment(startDate).dayOfYear();
        if (gammeYear === this.year.lastYear) {
            valueX = -6 + dayOfYearStart * 0.5;
        } else if (gammeYear === this.year.currentYear) {
            valueX = 173 + dayOfYearStart * 0.5;
        } else if (gammeYear === this.year.nextYear) {
            valueX = 353 + dayOfYearStart * 0.5;
        }

        let gammesNb = res.length;
        if (gammesNb === 1) {
            gammesNb = 0;
        }
        valueY += gammesNb * 60;

        return `translate(${valueX}, ${valueY})`;
    }

    /**
     * Method to calcul the transformation to apply on each Gant's user infos bloc.
     * @param gamme The current gamme
     * @return A translation as string
     */
    public getTransformUserInfos(gamme: IGammeGant, res: IGammeGant[]): string {
        let valueX = -294;
        let valueY = -160;
        const startDate = moment.utc(gamme.validityStart);
        const gammeYear = startDate.year();
        const dayOfYearStart = moment(startDate).dayOfYear();
        if (gammeYear === this.year.lastYear) {
            valueX = -294 + dayOfYearStart * 0.5;
        } else if (gammeYear === this.year.currentYear) {
            valueX = -115 + dayOfYearStart * 0.5;
        } else if (gammeYear === this.year.nextYear) {
            valueX = 65 + dayOfYearStart * 0.5;
        }

        let gammesNb = res.length;
        if (gammesNb === 1) {
            gammesNb = 0;
        }
        valueY += gammesNb * 60;

        return `translate(${valueX}, ${valueY})`;
    }

    public openDialogCreateAllocation(): void {
        const dialogRef = this.dialog.open(CreateAllocationSwitcherDialogComponent, {
            width: '600px',
            height: '420px',
            data: {
                allocationUnit: this.allocationUnit
            }
        });

        dialogRef.afterClosed()
            .pipe(
                exist(),
                withLatestFrom(this.refreshPage$)
            ).subscribe(() => this.refreshPage$.next(true));
    }

    public openDialogEditAllocation(gamme: IGammeGant): void {
        if (this.hasPalmaAccessOnPlantGiven()) {

            const dialogRef = this.dialog.open(EditAllocationSwitcherDialogComponent, {
                width: '600px',
                height: '420px',
            });

            const allocation = {
                id: gamme.id,
                value: gamme.value,
                comment: gamme.comment,
                validityStart: gamme.validityStart,
                allocationUnit: this.allocationUnit,
            } as IAllocationTemplate;

            this.allocationTemplateSwitcherSrv.next(allocation);

            dialogRef.afterClosed()
                .pipe(
                    exist(),
                    withLatestFrom(this.refreshPage$)
                ).subscribe(() => this.refreshPage$.next(true));
        }
    }

    /**
     * Method to check if user is a read user
     * return boolean
     */
    public hasPalmaAccessOnPlantGiven(): boolean {

        this.plant$.subscribe(plant => this.plant_ = plant);
        this.accountSrv.getAuthenticationState()
            .subscribe(auths => this.auths_ = auths);
        return hasPalmaAccessToPlant(this.auths_, this.plant_);
    }

    public openUserInfos(index: number): void {
        for (let i = 0; i < this.hideUserInfos.length; i++) {
            if (i === index) {
                this.hideUserInfos[i] = false;
            } else {
                this.hideUserInfos[i] = true;
            }
        }
    }

    public closeUserInfos(index: number): void {
        this.hideUserInfos[index] = !this.hideUserInfos[index];
    }

    /**
     * Method check if gamme's start validity date is after current month
     * @param date
     * @return boolean
     */
    public checkIfStartValidityDateIsAfterCurrentMonth(date: string): boolean {
        if (!date) {
            return false;
        }
        const current = moment();
        const validityStart = moment(date, 'YYYY-MM-DD');
        return (validityStart.year() > current.year()) ||
            ((validityStart.year() === current.year()) && (validityStart.month() >= current.month()));
    }

    /**
     * Method check if gamme's start validity date is before current month
     * @param date
     * @return boolean
     */
    public checkIfStartValidityDateIsBeforeCurrentMonth(date: string): boolean {
        if (!date) {
            return false;
        }
        const current = moment();
        const validityStart = moment(date, 'YYYY-MM-DD');
        return (validityStart.year() < current.year()) ||
            (validityStart.year() === current.year()) && (validityStart.month() < current.month());
    }

    public navigateBack(): void {
        this.router.navigate(['/product-gammes']);
    }

    public convertToMin(value: any): number {
        if (!!value || value === 0) {
            if (value === 0) {
                return 0;
            }
            value = (value * 60);
            if (value - Math.floor(value) !== 0 ) {
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

    public isAdminProfile(): boolean {
        this.accountSrv.getAuthenticationState()
            .subscribe(auths => this.auths_ = auths);
        return isAdmin(this.auths_);
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
