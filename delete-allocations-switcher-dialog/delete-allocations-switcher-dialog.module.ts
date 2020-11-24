import { NgModule } from '@angular/core';
import { DeleteAllocationsSwitcherDialogComponent } from './delete-allocations-switcher-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule,
         MatDialogModule,
         MatIconModule,
         MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
    declarations: [
        DeleteAllocationsSwitcherDialogComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    exports: [
        DeleteAllocationsSwitcherDialogComponent
    ]
})
export class DeleteAllocationsSwitcherDialogModule {}
