import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MatCardModule,
    MatIconModule
} from '@angular/material';
import { ProductService } from '../../shared/entity/search-product';
import { ProductCardComponent } from './product-card.component';

@NgModule({
    declarations: [
        ProductCardComponent
    ],
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule
    ],
    providers: [
        ProductService
    ],
    exports: [
        ProductCardComponent
    ]
})
export class ProductCardModule {}
