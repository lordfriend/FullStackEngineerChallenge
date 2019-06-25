import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminViewComponent } from './admin-view/admin-view.component';
import { EmployeeViewComponent } from './admin-view/employee-view/employee-view.component';
import { HomeComponent } from './home/home.component';
import { MyReviewComponent } from './my-review/my-review.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'employee',
    component: AdminViewComponent
  },
  {
    path: 'employee/:id',
    component: EmployeeViewComponent
  },
  {
    path: 'review',
    component: MyReviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
