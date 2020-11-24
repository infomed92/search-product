import { NgModule } from '@angular/core';
import { GammeDetailComponent } from './gamme-detail.component';
import { CommonModule } from '@angular/common';
import { Angulartics2Module } from 'angulartics2';
import { RouterModule } from '@angular/router';
import { GAMME_DETAIL_ROUTE } from './gamme-detail.route';
import { MatIconModule,
         MatDividerModule,
         MatProgressSpinnerModule,
         MatButtonModule,
         MatTooltipModule,
         MatRadioModule
} from '@angular/material';
import { ProductService } from 'app/pmt/shared/entity/search-product';
import { CreateAllocationSwitcherDialogModule,
         CreateAllocationSwitcherDialogComponent
} from '../create-allocation-switcher-dialog';
import { EditAllocationSwitcherDialogModule, EditAllocationSwitcherDialogComponent } from '../edit-allocation-switcher-dialog';
import { SharedDirectiveModule } from 'app/pmt/shared';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        GammeDetailComponent
    ],
    imports: [
        CommonModule,
        SharedDirectiveModule,
        Angulartics2Module,
        RouterModule.forChild([ GAMME_DETAIL_ROUTE ]),
        MatIconModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatTooltipModule,
        CreateAllocationSwitcherDialogModule,
        EditAllocationSwitcherDialogModule,
        MatRadioModule,
        FormsModule
    ],
    exports: [
        GammeDetailComponent
    ],
    providers: [
        ProductService
    ],
    entryComponents: [
        CreateAllocationSwitcherDialogComponent,
        EditAllocationSwitcherDialogComponent
    ]
})
export class GammeDetailModule {}
