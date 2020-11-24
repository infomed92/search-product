import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductGammesComponent } from '../product-gammes/product-gammes.component';
import { PRODUCT_GAMMES_ROUTE } from './product-gammes.route';
import { ProductService } from '../../shared/entity/search-product';
import { MatIconModule,
         MatDividerModule,
         MatCardModule,
         MatTabsModule,
         MatTableModule,
         MatListModule,
         MatButtonModule,
         MatFormFieldModule,
         MatInputModule,
         MatProgressSpinnerModule,
         MatTooltipModule,
         MatDatepickerModule,
         MatNativeDateModule,
         MatSlideToggleModule,
         MatRadioModule
} from '@angular/material';
import { CostCenterCpSwitcherDialogComponent } from '../cost-center-cp-switcher-dialog/cost-center-cp-switcher-dialog.component';
import { CostCenterCpSwitcherDialogModule } from '../cost-center-cp-switcher-dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TreeGridModule,
         PageService,
         SortService,
         FilterService,
         ResizeService
} from '@syncfusion/ej2-angular-treegrid';
import { DeleteAllocationsSwitcherDialogComponent,
         DeleteAllocationsSwitcherDialogModule
} from '../delete-allocations-switcher-dialog';
import { ProductNomenclatureModule } from '../product-nomenclature';
import { SharedDirectiveModule } from 'app/pmt/shared';

@NgModule({
    declarations: [
        ProductGammesComponent
    ],
    imports: [
        CommonModule,
        SharedDirectiveModule,
        ReactiveFormsModule,
        RouterModule.forChild([ PRODUCT_GAMMES_ROUTE ]),
        MatIconModule,
        MatDividerModule,
        MatCardModule,
        MatTabsModule,
        MatTableModule,
        MatListModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSlideToggleModule,
        TreeGridModule,
        CostCenterCpSwitcherDialogModule,
        DeleteAllocationsSwitcherDialogModule,
        ProductNomenclatureModule,
        MatRadioModule,
        FormsModule
    ],
    providers: [
        ProductService,
        PageService,
        SortService,
        FilterService,
        ResizeService
    ],
    exports: [
        ProductGammesComponent
    ],
    entryComponents: [
        CostCenterCpSwitcherDialogComponent,
        DeleteAllocationsSwitcherDialogComponent
    ]
})
export class ProductGammesModule {}
