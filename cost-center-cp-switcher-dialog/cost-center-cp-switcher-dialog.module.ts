import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatButtonModule,
    MatDialogModule
} from '@angular/material';
import { CostCenterCpSwitcherDialogComponent } from './cost-center-cp-switcher-dialog.component';
import { CostCenterCpByPhaseDropdownModule } from '../cost-center-cp-by-phase-dropdown/cost-center-cp-by-phase-dropdown.module';

@NgModule({
    declarations: [
        CostCenterCpSwitcherDialogComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        CostCenterCpByPhaseDropdownModule
    ],
    exports: [
        CostCenterCpSwitcherDialogComponent
    ]
})
export class CostCenterCpSwitcherDialogModule {}
