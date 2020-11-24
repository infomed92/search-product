import { Route } from '@angular/router';

import { SearchProductComponent } from './search-product.component';

export const SEARCH_PRODUCT_ROUTE: Route = {
    path: '',
    component: SearchProductComponent,
    data: {
        authorities: [],
        pageTitle: 'pmtApp.search-product.title'
    }
};
