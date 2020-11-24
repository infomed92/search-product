import { Route } from '@angular/router';

import { GammeDetailComponent } from './gamme-detail.component';

export const GAMME_DETAIL_ROUTE: Route = {
    path: '',
    component: GammeDetailComponent,
    data: {
        authorities: [],
        pageTitle: 'pmtApp.gamme-detail.title'
    }
};
