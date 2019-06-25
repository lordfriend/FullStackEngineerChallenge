import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AccountService } from './account.service';
import { AdminViewService } from './admin-view/admin-view.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminViewComponent } from './admin-view/admin-view.component';
import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatCardModule,
  MatChipsModule, MatAutocompleteModule, MatSnackBarModule
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { EmployeeDialogComponent } from './admin-view/employee-dialog/employee-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeViewComponent } from './admin-view/employee-view/employee-view.component';
import { ReviewListComponent } from './review-list/review-list.component';
import { ReviewDialogComponent } from './review-list/review-dialog/review-dialog.component';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { HomeComponent } from './home/home.component';
import { MyReviewComponent } from './my-review/my-review.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminViewComponent,
    EmployeeDialogComponent,
    EmployeeViewComponent,
    ReviewListComponent,
    ReviewDialogComponent,
    AlertDialogComponent,
    HomeComponent,
    MyReviewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    LayoutModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  providers: [AdminViewService, AccountService],
  bootstrap: [AppComponent],
  entryComponents: [EmployeeDialogComponent, ReviewDialogComponent, AlertDialogComponent]
})
export class AppModule { }
