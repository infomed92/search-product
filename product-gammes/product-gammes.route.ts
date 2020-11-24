import { Route } from '@angular/router';

import { ProductGammesComponent } from './product-gammes.component';

export const PRODUCT_GAMMES_ROUTE: Route = {
    path: '',
    component: ProductGammesComponent,
    data: {
        authorities: [],
        pageTitle: 'pmtApp.product-gammes.title'
    }
};
