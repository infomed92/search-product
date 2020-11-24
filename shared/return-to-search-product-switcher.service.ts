import { Injectable } from '@angular/core';
import { SwitcherAbstractService } from 'app/pmt/shared/abstract';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ReturnToSearchProductSwitcherService
        extends SwitcherAbstractService<boolean> {

    constructor() {
        super();
    }

    protected getBehaviorSubject(): BehaviorSubject<boolean> {
        return new BehaviorSubject<boolean>(false);
    }

}
