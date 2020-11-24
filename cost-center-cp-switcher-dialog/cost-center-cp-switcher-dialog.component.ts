import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { IPlant } from '../../../shared/model/plant.model';
import { IPhase } from '../../../shared/model/phase.model';
import { PlantSwitcherService } from '../../shared/service/plant-switcher';
import { PhaseSwitcherService } from '../../shared/service/phase-switcher';
import { ICostCenterCpByPlantPhase } from 'app/pmt/shared/entity/cost-center/cost-center-cp-by-plant-phase.interface';

@Component({
    selector: 'pmt-cost-center-cp-switcher-dialog',
    styleUrls: ['./cost-center-cp-switcher-dialog.component.scss'],
    templateUrl: './cost-center-cp-switcher-dialog.component.html'
})
export class CostCenterCpSwitcherDialogComponent implements OnInit {

    public plant$: Observable<IPlant>;
    public phase$: Observable<IPhase>;

    public costCenter$: BehaviorSubject<ICostCenterCpByPlantPhase> = new BehaviorSubject(undefined);

    constructor(
        private readonly plantSwitcherSrv: PlantSwitcherService,
        private readonly phaseSwitcherSrv: PhaseSwitcherService
    ) {}

    public ngOnInit() {
        this.plant$ = this.plantSwitcherSrv.asObservable();
        this.phase$ = this.phaseSwitcherSrv.asObservable();
    }
}
