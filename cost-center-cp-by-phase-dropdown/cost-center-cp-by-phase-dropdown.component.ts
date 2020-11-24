import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { takeWhile, tap, filter, mergeMap, share, delay } from 'rxjs/operators';
import { IPlant } from '../../../shared/model/plant.model';
import { IPhase } from '../../../shared/model/phase.model';
import { CostCenterCpByPlantPhaseService } from 'app/pmt/shared/entity/cost-center/cost-center-cp-by-plant-phase.service';
import { ICostCenterCpByPlantPhase } from 'app/pmt/shared/entity/cost-center/cost-center-cp-by-plant-phase.interface';

@Component({
    selector: 'pmt-cost-center-cp-by-phase-dropdown',
    styleUrls: ['./cost-center-cp-by-phase-dropdown.component.scss'],
    templateUrl: './cost-center-cp-by-phase-dropdown.component.html'
})
export class CostCenterCpByPhaseDropdownComponent implements OnInit, OnDestroy {

    @Input()
    public name: string;

    @Input()
    public plant$: Observable<IPlant>;

    @Input()
    public phase$: Observable<IPhase>;

    @Output()
    public readonly onChange: EventEmitter<ICostCenterCpByPlantPhase> = new EventEmitter();

    public costCenter$: Observable<ICostCenterCpByPlantPhase[]>;

    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    public alive = true;

    constructor(
        private readonly costCenterCpSrv: CostCenterCpByPlantPhaseService
    ) {}

    public ngOnInit() {
        this.costCenter$ = combineLatest(this.plant$, this.phase$)
            .pipe(
                takeWhile(() => this.alive),
                tap(([plant, phase]: [IPlant, IPhase]) => {
                    if (!plant || !phase) {
                        this.onChange.emit();
                    }
                }),
                filter(([plant, phase]: [IPlant, IPhase]) => !!plant && !!phase),
                tap(() => {
                    this.onChange.emit();
                }),
                mergeMap(([plant, phase]: [IPlant, IPhase]) => {
                    return this.costCenterCpSrv.query(plant, phase);
                }),
                share()
            );

        this.costCenter$
            .pipe(delay(1000))
            .subscribe(() => this.loading$.next(false));
    }

    public filter(query: string, costCenters: ICostCenterCpByPlantPhase[]): ICostCenterCpByPlantPhase[] {
        return costCenters.filter(costCenter => {
            return !!costCenter.name
                && costCenter.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
                || !!costCenter.costcenterId
                && costCenter.costcenterId.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
    }

    public displayWith(costCenter: ICostCenterCpByPlantPhase): string {
        return `${costCenter.costcenterId} - ${costCenter.name}`;
    }

    public ngOnDestroy() {
        this.alive = false;
    }
}
