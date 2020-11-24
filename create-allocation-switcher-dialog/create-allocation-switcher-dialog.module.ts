import { NgModule } from '@angular/core';
import { CreateAllocationSwitcherDialogComponent } from './create-allocation-switcher-dialog.component';
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
        CreateAllocationSwitcherDialogComponent
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
        CreateAllocationSwitcherDialogComponent
    ]
})
export class CreateAllocationSwitcherDialogModule {}
