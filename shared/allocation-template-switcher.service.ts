import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IAllocationTemplate } from './allocation-template.interface';

@Injectable()
export class AllocationTemplateSwitcherService {

    private readonly allocationTemplate$: BehaviorSubject<IAllocationTemplate> = new BehaviorSubject(undefined);

    public next(allocation: IAllocationTemplate): void {
        this.allocationTemplate$.next(allocation);
    }

    public getValue(): IAllocationTemplate {
        return this.allocationTemplate$.getValue();
    }

    public asObservable(): Observable<IAllocationTemplate> {
        return this.allocationTemplate$.asObservable();
    }
}
