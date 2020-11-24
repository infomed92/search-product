import { NgModule } from '@angular/core';
import { ProductNomenclatureComponent } from './product-nomenclature.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule,
         MatTabsModule,
         MatButtonModule,
         MatFormFieldModule,
         MatInputModule,
         MatDatepickerModule,
         MatNativeDateModule,
         MatSlideToggleModule
} from '@angular/material';
import { TreeGridNomenclatureModule } from './tree-grid-nomenclature';
import { GridNomenclatureModule } from './grid-nomenclature';

@NgModule({
    declarations: [
        ProductNomenclatureComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatTabsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSlideToggleModule,
        TreeGridNomenclatureModule,
        GridNomenclatureModule
    ],
    providers: [

    ],
    exports: [
        ProductNomenclatureComponent
    ]
})
export class ProductNomenclatureModule {}
