import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { of } from 'rxjs';
import {
    filter,
    concatMap,
    map
} from 'rxjs/operators';
import { PlantSwitcherService } from 'app/pmt/shared/service/plant-switcher';
import { PhaseSwitcherService } from 'app/pmt/shared/service/phase-switcher';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import * as moment from 'moment';
import { ProductService } from 'app/pmt/shared/entity/search-product';
import { ProductSwitcherService } from 'app/pmt/shared/service/product-switcher';
import { CostCenterCpSwitcherService } from 'app/pmt/shared/service/cost-center-cp-switcher';
import { IAllocationTemplate } from '../shared/allocation-template.interface';
import { AllocationIndicatorSwitcherService } from 'app/pmt/shared/service/allocation-indicator';
import { NomenclatureSwitcherService } from 'app/pmt/shared/service/nomenclature/nomenclature-switcher.service';
import { IGammeGant } from '../shared';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../shared/datepicker.adapter';
import { MAT_DATE_LOCALE } from '@angular/material';
import { AccountService } from 'app/core';
import { isAdmin } from 'app/pmt/shared/utils/auth';

export interface DialogData {
    allocationUnit: string;
}

@Component({
    selector: 'pmt-create-allocation-switcher-dialog',
    styleUrls: ['create-allocation-switcher-dialog.component.scss'],
    templateUrl: 'create-allocation-switcher-dialog.component.html',
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
export class CreateAllocationSwitcherDialogComponent implements OnInit {
    public createAllocationForm = new FormGroup({
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

    public isLoading = false;
    public error: any;

    now = new Date();
    year = this.now.getFullYear();
    month = this.now.getMonth();
    minDate = new Date();
    maxDate = new Date();
    public allocationUnitValue: string;
    private auths_: string[];
    constructor(
        private readonly dialogRef: MatDialogRef<any>,
        private readonly plantSwitcherSrv: PlantSwitcherService,
        private readonly phaseSwitcherSrv: PhaseSwitcherService,
        private readonly productSwitcherSrv: ProductSwitcherService,
        private readonly costCenterCpSwitcherSrv: CostCenterCpSwitcherService,
        private readonly allocationIndicatorSwitcherSrv: AllocationIndicatorSwitcherService,
        private readonly nomenclatureSwitcherSrv: NomenclatureSwitcherService,
        private readonly productSrv: ProductService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public dialog: MatDialog,
        private readonly accountService: AccountService
    ) { }

    ngOnInit() {
        this.isAdminProfile();
        this.allocationUnitValue = this.data.allocationUnit;
        if (this.allocationUnitValue === 'HOURS') {
            this.formControlValueHoursChanged();
        } else {
            this.formControlValueMinutesChanged();
        }
    }
    public get value() {
        return this.createAllocationForm.get('value');
    }

    public get comment() {
        return this.createAllocationForm.get('comment');
    }

    public get startValidityDate() {
        return this.createAllocationForm.get('startValidityDate');
    }

    public get valueMinutes() {
        return this.createAllocationForm.get('valueMinutes');
    }
    public onValid() {
        this.isLoading = true;
        this.error = undefined;

        of(this.createAllocationForm)
            .pipe(
                filter((form: FormGroup) => form.valid),
                map((form: FormGroup) => {
                    const plant = this.plantSwitcherSrv.getValue();
                    const phase = this.phaseSwitcherSrv.getValue();
                    const product = this.productSwitcherSrv.getValue();
                    const costCenter = this.costCenterCpSwitcherSrv.getValue();
                    const allocationIndicator = this.allocationIndicatorSwitcherSrv.getValue();
                    const nomenclature = this.nomenclatureSwitcherSrv.getValue();
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
                        plantId: plant.id,
                        phaseId: phase.id,
                        productId: product.id,
                        costcenterId: costCenter.id,
                        value: body.value,
                        comment: body.comment,
                        validityStart,
                        nomenclature,
                        allocationIndicator
                    } as IGammeGant;
                }),
                concatMap((gamme: IGammeGant) => {
                    return this.productSrv.queryCreateAllocation(gamme);
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

    public formControlValueHoursChanged() {
        this.createAllocationForm.get('value').valueChanges.subscribe(
            (mode: number) => {
                if (!!mode || mode === 0) {
                    const modeVal = (mode * 60) + '';
                    this.createAllocationForm.get('valueMinutes').setValue(parseFloat(modeVal).toFixed(6));
                } else {
                    this.createAllocationForm.get('valueMinutes').setValue(null);
                }
            });
    }

    public formControlValueMinutesChanged() {
        this.createAllocationForm.get('valueMinutes').valueChanges.subscribe(
            (mode: number) => {
                if (!!mode || mode === 0) {
                    const modeVal = (mode / 60) + '';
                    this.createAllocationForm.get('value').setValue(parseFloat(modeVal).toPrecision());
                    this.createAllocationForm.get('valuehours').setValue(parseFloat(modeVal).toFixed(6));
                } else {
                    this.createAllocationForm.get('value').setValue(null);
                }
            });
    }
}
