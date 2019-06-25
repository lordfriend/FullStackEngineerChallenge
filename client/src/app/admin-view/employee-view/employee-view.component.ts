import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';
import { Employee } from '../../entity/employee';
import { ReviewDialogComponent } from '../../review-list/review-dialog/review-dialog.component';
import { AdminViewService } from '../admin-view.service';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.less']
})
export class EmployeeViewComponent implements OnInit {
  employeeForm = this.fb.group({
    name: [null, Validators.required],
    password: [null, Validators.required],
    level: [1, Validators.required]
  });

  employeeId;
  employee: Employee;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private _adminViewService: AdminViewService,
              public dialog: MatDialog) {}

  removeEmployee(): void {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '350px',
      data: this.employee.name
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this._adminViewService.removeEmployee(this.employee.id)
          .subscribe(() => {
            console.log('removed');
            this.router.navigateByUrl('/employee');
          });
      }
    })
  }

  onSubmit(): void {
    this._adminViewService
      .addEmployee(this.employeeForm.value)
      .subscribe(() => {
      });
  }

  ngOnInit(): void {
    this.employeeId = Number.parseInt(this.route.snapshot.paramMap.get('id'));
    this._adminViewService.getEmployee(this.employeeId)
      .subscribe(employee => {
        this.employee = employee;
        this.employeeForm.setValue({
          name: employee.name,
          password: null,
          level: employee.level
        });
      })
  }
}
