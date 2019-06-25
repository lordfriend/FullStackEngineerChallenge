import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { AccountService } from './account.service';
import { Employee } from './entity/employee';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  currentUser: Employee;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.userObservable
      .subscribe((user) => {
        this.currentUser = user;
      });
  }
}
