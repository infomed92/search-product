import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
} from '@angular/material';

import { FilterComponent } from './filter.component';

@NgModule({
    declarations: [
        FilterComponent
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
    ],
    exports: [
        FilterComponent
    ]
})
export class FilterModule {}
