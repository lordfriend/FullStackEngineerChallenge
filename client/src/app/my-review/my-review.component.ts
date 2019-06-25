import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { AdminViewService } from '../admin-view/admin-view.service';
import { Employee } from '../entity/employee';

@Component({
  selector: 'app-my-review',
  templateUrl: './my-review.component.html',
  styleUrls: ['./my-review.component.less']
})
export class MyReviewComponent implements OnInit {

  employee: Employee;

  constructor(private adminViewService: AdminViewService,
              private accountService: AccountService) { }

  ngOnInit() {
    this.employee = this.accountService.currentUser;
  }

}
