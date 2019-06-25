import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.less']
})
export class AlertDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AlertDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
