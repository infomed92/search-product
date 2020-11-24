import { NgModule } from '@angular/core';
import { EditAllocationSwitcherDialogComponent } from './edit-allocation-switcher-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule,
         MatDialogModule,
         MatFormFieldModule,
         MatInputModule,
         MatDatepickerModule,
         MatNativeDateModule,
         MatProgressSpinnerModule,
         MatIconModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        EditAllocationSwitcherDialogComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatIconModule,
        ReactiveFormsModule
    ],
    exports: [
        EditAllocationSwitcherDialogComponent
    ]
})
export class EditAllocationSwitcherDialogModule {}
