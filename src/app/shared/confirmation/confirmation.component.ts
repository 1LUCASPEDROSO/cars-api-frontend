import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {
  title: string = "Exclusão"
  message: string = "Confirma Exclusão?"
  message2: string = ""

constructor(public dialogRef: MatDialogRef<ConfirmationComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  this.title = data?.title ?? this.title;
  this.message = data?.message ?? this.message;
  this.message2 = data?.message2 ?? this.message2;

}

onNoClick(): void {
  this.dialogRef.close(false);
}

onYesClick(): void {
  this.dialogRef.close(true);
}

}
