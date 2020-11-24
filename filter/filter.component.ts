import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'pmt-filter',
    styleUrls: ['./filter.component.scss'],
    templateUrl: './filter.component.html'
})
export class FilterComponent implements OnInit {

    @Output()
    public onChange: EventEmitter<string> = new EventEmitter();

    public input$ = new Subject<string>();

    public ngOnInit() {
        this.input$
            .pipe(
                distinctUntilChanged()
            )
            .subscribe(this.onChange);
    }
}
