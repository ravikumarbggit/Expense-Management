import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule, MatButtonModule, DateAdapter, MatNativeDateModule, MatSidenavModule } from '@angular/material';
// import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DateFormat } from './date-format';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { HttpClientModule } from '@angular/common/http';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { HammerCardComponent } from './hammer-card/hammer-card.component';
import { ExpenseComponent } from './expense/expense.component';
import {MatSelectModule} from '@angular/material/select';
import { NotFoundComponent } from './not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { ConfirmationDialog } from './utils/confirmation-dialog';
import { AlertDialog } from './utils/alert-dialog';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { AboutComponent } from './about/about.component';
import { SignupComponent } from './signup/signup.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { ExpenseItemComponent } from './expense-item/expense-item.component';
import { ExpenseViewComponent } from './expense-view/expense-view.component';

@NgModule({
  declarations: [
    AppComponent,
    ExpenseListComponent,
    HammerCardComponent,
    ExpenseComponent,
    NotFoundComponent,
    HeaderComponent,
    ConfirmationDialog,
    AlertDialog,
    LoginComponent,
    AppLayoutComponent,
    AboutComponent,
    SignupComponent,
    HomeHeaderComponent,
    ExpenseItemComponent,
    ExpenseViewComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,  
    // MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule, 
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatSnackBarModule,
    DragDropModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: DateFormat },
    AuthService,
    AuthGuard,
  ],
  entryComponents: [ConfirmationDialog, AlertDialog, ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private dateAdapter:DateAdapter<Date>,
    ) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY

  }
}
