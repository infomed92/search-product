import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material';
import { CostCenterCpByPhaseDropdownComponent } from './cost-center-cp-by-phase-dropdown.component';
import { GenericDropdownModule } from 'app/pmt/shared/component/generic-dropdown/generic-dropdown.module';
import { CostCenterCpByPlantPhaseService } from 'app/pmt/shared/entity/cost-center/cost-center-cp-by-plant-phase.service';

@NgModule({
    declarations: [
        CostCenterCpByPhaseDropdownComponent
    ],
    imports: [
        CommonModule,
        GenericDropdownModule,
        MatProgressSpinnerModule
    ],
    providers: [
        CostCenterCpByPlantPhaseService
    ],
    exports: [
        CostCenterCpByPhaseDropdownComponent
    ]
})
export class CostCenterCpByPhaseDropdownModule {}
