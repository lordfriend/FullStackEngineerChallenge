import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent,
  MatDialogRef
} from '@angular/material';
import { Observable } from 'rxjs/index';
import { map, startWith } from 'rxjs/internal/operators';
import { isString } from 'util';
import { AdminViewService } from '../../admin-view/admin-view.service';
import { Employee } from '../../entity/employee';
import { Review } from '../../entity/review';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.less']
})
export class ReviewDialogComponent implements OnInit {
  reviewForm = this.fb.group({
    performance: [null, Validators.required],
    feedback: [null],
    // status: [1, Validators.required],
    reviewed_by: []
  });

  review: Review;

  employees: Employee[] = [];

  isEdit = false;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  employeeCtrl = new FormControl();
  filteredEmployees: Observable<Employee[]>;

  @ViewChild('employeeInput', {static: false}) employeeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<ReviewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Review,
              private _adminViewService: AdminViewService) {
    this.review = data;
    if (Number.isInteger(this.review.id)) {
      this.isEdit = true;
    }
    if (this.review.performance) {
      this.reviewForm.patchValue({performance: this.review.performance});
    }
    if (this.review.feedback) {
      this.reviewForm.patchValue({feedback: this.review.feedback});
    }
    if (!this.review.reviewed_by) {
      this.review.reviewed_by = [];
    }
    this.filteredEmployees = this.employeeCtrl.valueChanges.pipe(
      startWith(null),
      map((name: string | null) => isString(name) ? this._filter(name) : this.employees.slice()));
  }

  add(event: MatChipInputEvent): void {
    // Add employee only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    // if (!this.matAutocomplete.isOpen) {
    //   const input = event.input;
    //   const value = event.value;
    //
    //   // Add our employee
    //   if ((value || '').trim()) {
    //     this.review.reviewedBy.push(value);
    //   }
    //
    //   // Reset the input value
    //   if (input) {
    //     input.value = '';
    //   }
    //
    //   this.employeeCtrl.setValue(null);
    // }
  }

  remove(employee: Employee): void {
    const index = this.review.reviewed_by.indexOf(employee);

    if (index >= 0) {
      this.review.reviewed_by.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.review.reviewed_by.push(event.option.value);
    this.employeeInput.nativeElement.value = '';
    this.employeeCtrl.setValue(null);
  }

  private _filter(value: string): Employee[] {
    const name = value.toLowerCase();

    return this.employees.filter(e => e.name.toLowerCase().indexOf(name) === 0);
  }

  onSubmit() {
    this.review.performance = this.reviewForm.value.performance;
    this.review.feedback = this.reviewForm.value.feedback;
    if (this.isEdit) {
      this._adminViewService
        .updateReview(this.review)
        .subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this._adminViewService
        .addReview(this.review)
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  ngOnInit(): void {
    // We should use some backend API to filter employee base on criteria (like name).
    // but here in order to reduce complexity. we filter in the browser
    this._adminViewService.getAllEmployees()
      .subscribe(list => {
        this.employees = list.filter(e => e.id != this.review.employee_id);
      })
  }

}
