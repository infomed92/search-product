import { NgModule } from '@angular/core';
import {
    PageService,
    FilterService,
    ResizeService,
    ExcelExportService,
    GridModule,
    ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { GridNomenclatureComponent } from './grid-nomenclature.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';

@NgModule({
    declarations: [
        GridNomenclatureComponent
    ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        GridModule
    ],
    exports: [
        GridNomenclatureComponent
    ],
    providers: [
        PageService,
        FilterService,
        ResizeService,
        ExcelExportService,
        ToolbarService
    ]
})
export class GridNomenclatureModule {}
