import { NgModule } from '@angular/core';
import { Angulartics2Module } from 'angulartics2';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule,
         MatButtonModule,
         MatTooltipModule,
         MatSnackBarModule
} from '@angular/material';
import { FilterModule } from './filter';
import { ProductCardModule } from './card/product-card.module';
import { ProductService } from '../shared/entity/search-product/product.service';
import { SearchProductComponent } from './search-product.component';
import { SEARCH_PRODUCT_ROUTE } from './search-product.route';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        SearchProductComponent
    ],
    imports: [
        CommonModule,
        Angulartics2Module,
        RouterModule.forChild([ SEARCH_PRODUCT_ROUTE ]),
        FilterModule,
        ProductCardModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatTooltipModule,
        MatSnackBarModule
    ],
    exports: [
        SearchProductComponent
    ],
    providers: [
        ProductService
    ]
})
export class SearchProductModule {}
