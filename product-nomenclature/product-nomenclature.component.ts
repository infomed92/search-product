import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { APP_DATE_FORMATS, AppDateAdapter } from 'app/shared/datepicker.adapter';
import { ThemePalette } from '@angular/material/core';

@Component({
    selector: 'pmt-product-nomenclature',
    styleUrls: ['product-nomenclature.component.scss'],
    templateUrl: 'product-nomenclature.component.html',
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
export class ProductNomenclatureComponent {

    @Input()
    public allocationUnit: string;

    public validityDate = new FormControl({ value: new Date, disabled: true });

    public color: ThemePalette = 'accent';
    public checked = false;

    public toggle(): void {
        this.checked = !this.checked;
    }

}
