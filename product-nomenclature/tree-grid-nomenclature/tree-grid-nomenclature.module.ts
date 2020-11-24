import { NgModule } from '@angular/core';
import { PageService,
         FilterService,
         ResizeService,
         ToolbarService,
         TreeGridModule
} from '@syncfusion/ej2-angular-treegrid';
import { TreeGridNomenclatureComponent } from './tree-grid-nomenclature.component';
import { CommonModule } from '@angular/common';
import {
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatListModule
} from '@angular/material';

@NgModule({
    declarations: [
        TreeGridNomenclatureComponent
    ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatListModule,
        TreeGridModule
    ],
    exports: [
        TreeGridNomenclatureComponent
    ],
    providers: [
        PageService,
        FilterService,
        ResizeService,
        ToolbarService
    ]
})
export class TreeGridNomenclatureModule {}
