import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Employee } from '../../entity/employee';
import { AdminViewService } from '../admin-view.service';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.less']
})
export class EmployeeDialogComponent {
  employeeForm = this.fb.group({
    name: [null, Validators.required],
    password: [null, Validators.required],
    level: [1, Validators.required]
  });

  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<EmployeeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Employee,
              private _adminViewService: AdminViewService) {}

  onSubmit() {
    this._adminViewService
      .addEmployee(this.employeeForm.value)
      .subscribe(() => {
        this.dialogRef.close();
      });

  }
}
