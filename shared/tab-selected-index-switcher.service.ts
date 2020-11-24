import { Injectable } from '@angular/core';
import { SwitcherAbstractService } from 'app/pmt/shared/abstract';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TabSelectedIndexSwitcherService
        extends SwitcherAbstractService<number> {

    constructor() {
        super();
    }

    protected getBehaviorSubject(): BehaviorSubject<number> {
        return new BehaviorSubject<number>(0);
    }

}
