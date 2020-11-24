import { Component, Input } from '@angular/core';
import { IProduct } from '../../shared/entity/search-product';
import { Router } from '@angular/router';
import { ProductSwitcherService } from 'app/pmt/shared/service/product-switcher/product-switcher.service';

@Component({
    selector: 'pmt-product-card',
    styleUrls: ['./product-card.component.scss'],
    templateUrl: './product-card.component.html'
})
export class ProductCardComponent {

    @Input()
    public product: IProduct;

    constructor(
        private readonly route: Router,
        private readonly productSwitcherSrv: ProductSwitcherService
    ) {}

    public goToProductGammesList(product: IProduct) {
        this.productSwitcherSrv.next(product);
        this.route.navigate(['/product-gammes']);
    }
}
