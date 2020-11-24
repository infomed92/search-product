import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AllocationTemplateSwitcherService, IGammeInput } from '../shared';
import { ProductService } from 'app/pmt/shared/entity/search-product';
import { MatDialogRef } from '@angular/material';
import { IAllocationTemplate } from '../shared/allocation-template.interface';
import * as moment from 'moment';
import { of } from 'rxjs';
import {
    filter,
    concatMap,
    map
} from 'rxjs/operators';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../shared/datepicker.adapter';
import { MAT_DATE_LOCALE } from '@angular/material';
import { AccountService } from 'app/core';
import { isAdmin } from 'app/pmt/shared/utils/auth';

@Component({
    selector: 'pmt-edit-allocation-switcher-dialog',
    styleUrls: ['edit-allocation-switcher-dialog.component.scss'],
    templateUrl: 'edit-allocation-switcher-dialog.component.html',
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        },
        {
            provide: MAT_DATE_LOCALE, useValue: 'en-GB'
        }
    ]
})
export class EditAllocationSwitcherDialogComponent implements OnInit {

    public isLoading = false;
    public error: any;
    public allocationTemplate: IAllocationTemplate;

    now = new Date();
    year = this.now.getFullYear();
    month = this.now.getMonth();

    public minDate = new Date();
    public maxDate = new Date();
    private auths_: string[];
    public editAllocationForm = new FormGroup({
        value: new FormControl('', [
            Validators.required,
            Validators.min(0),
            Validators.max(1000)
        ]),
        valueMinutes: new FormControl('', [
            Validators.required,
            Validators.min(0)
        ]),
        valuehours: new FormControl('', [
        ]),
        startValidityDate: new FormControl('', [
            Validators.required
        ]),
        comment: new FormControl('', [
            Validators.minLength(0),
            Validators.maxLength(200),
            Validators.pattern('[a-zA-Z0-9.,;-_()!?\' ]*')
        ])
    });

    constructor(
        private readonly dialogRef: MatDialogRef<any>,
        private readonly allocationTemplateSwitcherSrv: AllocationTemplateSwitcherService,
        private readonly productSrv: ProductService,
        private readonly accountService: AccountService
    ) { }

    ngOnInit() {
        this.isAdminProfile();
        this.allocationTemplate = this.allocationTemplateSwitcherSrv.getValue();
        this.editAllocationForm.setValue({
            value: this.allocationTemplate.value  % 1 === 0 ? this.allocationTemplate.value : this.allocationTemplate.value.toFixed(6),
            startValidityDate: new Date(this.allocationTemplate.validityStart),
            comment: this.allocationTemplate.comment,
            valueMinutes: (this.allocationTemplate.value * 60) % 1 === 0 ? (this.allocationTemplate.value * 60) : (this.allocationTemplate.value * 60).toFixed(6),
            valuehours: this.allocationTemplate.value % 1 === 0 ? this.allocationTemplate.value : (this.allocationTemplate.value).toFixed(6),
        });

        if (this.allocationTemplate.allocationUnit === 'HOURS') {
            this.formControlValueHoursChanged();
        } else {
            this.formControlValueMinutesChanged();
        }
    }

    public get value() {
        return this.editAllocationForm.get('value');
    }

    public get comment() {
        return this.editAllocationForm.get('comment');
    }

    public get startValidityDate() {
        return this.editAllocationForm.get('startValidityDate');
    }

    public get allocationUnit() {
        return this.editAllocationForm.get('allocationUnit');
    }

    public get valueMinutes() {
        return this.editAllocationForm.get('valueMinutes');
    }
    public onValid() {
        this.isLoading = true;
        this.error = undefined;

        of(this.editAllocationForm)
            .pipe(
                filter((form: FormGroup) => form.valid),
                map((form: FormGroup) => {
                    const body: IAllocationTemplate = {
                        value: form.get('value').value,
                        comment: form.get('comment').value,
                        validityStart: form.get('startValidityDate').value
                    };
                    const validityStart = moment.utc([
                        body.validityStart.getFullYear(),
                        body.validityStart.getMonth() + 1,
                        body.validityStart.getDate()
                    ].join('/'), 'YYYY/MM/DD');

                    return {
                        gammeId: this.allocationTemplate.id,
                        value: body.value,
                        comment: body.comment,
                        validityStart,
                    } as IGammeInput;
                }),
                concatMap((gamme: IGammeInput) => {
                    return this.productSrv.queryEditAllocation(gamme);
                })

            )
            .subscribe(data => {
                this.isLoading = false;
                this.dialogRef.close(data);
            }, err => {
                this.isLoading = false;
                this.error = err.error;
            });

    }

    public formControlValueHoursChanged() {
        this.editAllocationForm.get('value').valueChanges.subscribe(
            (mode: number) => {
                if (!!mode || mode === 0) {
                    const modeVal = (mode * 60) + '';
                    this.editAllocationForm.get('valueMinutes').setValue(parseFloat(modeVal).toFixed(6));
                } else {
                    this.editAllocationForm.get('valueMinutes').setValue(null);
                }
            });
    }

    public formControlValueMinutesChanged() {
        this.editAllocationForm.get('valueMinutes').valueChanges.subscribe(
            (mode: any) => {
                if (!!mode || mode === 0) {
                    const modeVal = (mode / 60) + '';
                    this.editAllocationForm.get('value').setValue(parseFloat(modeVal).toPrecision());
                    this.editAllocationForm.get('valuehours').setValue(parseFloat(modeVal).toFixed(6));
                } else {
                    this.editAllocationForm.get('value').setValue(null);
                }
            });
    }

    public isAdminProfile(): boolean {
        this.accountService.getAuthenticationState()
            .subscribe(auths => this.auths_ = auths);
        if (isAdmin(this.auths_)) {
            this.minDate = new Date(this.year, 0, 1);
            this.maxDate = new Date(this.year + 1, 11, 31);
        } else {
            this.minDate = new Date(this.year, this.month);
            this.maxDate = new Date(this.year + 1, 11, 31);
        }
        return isAdmin(this.auths_);
    }

}
