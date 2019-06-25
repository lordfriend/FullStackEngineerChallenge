import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AccountService } from '../account.service';
import { Employee } from '../entity/employee';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  loginForm = this.fb.group({
    name: [null, Validators.required],
    password: [null, Validators.required]
  });

  user: Employee;

  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private _snackBar: MatSnackBar) {
    this.user = this.accountService.currentUser;
  }

  onSubmit() {
    const name = this.loginForm.value.name;
    const password = this.loginForm.value.password;
    this.accountService.login(name, password)
      .subscribe(user => {
        this.user = user;
        this.loginForm.reset();
      }, (reason) => {
        let snackBarRef = this._snackBar.open(reason.data);
      });
  }

  logout() {
    this.accountService.logout()
      .subscribe(() => {
        this.user = null;
      })
  }

  ngOnInit(): void {
  }

}
