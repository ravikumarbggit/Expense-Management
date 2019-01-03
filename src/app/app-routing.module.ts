import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseComponent } from './expense/expense.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { AboutComponent } from './about/about.component';
import { SignupComponent } from './signup/signup.component';
import { ExpenseViewComponent } from './expense-view/expense-view.component';


const routes: Routes = [
  {        
    path: '', component: ExpenseListComponent,
    canActivate: [AuthGuard],
    data: { state: 'app-expense-list' }
  },
  {
    path: 'app-expense/:id',
    canActivate: [AuthGuard],
    component: ExpenseComponent,
    data: { state: 'app-expense' }
  },
  {
    path: 'app-expense',
    canActivate: [AuthGuard],
    component: ExpenseComponent,
    data: { state: 'app-expense' }
  }, 
  {
    path:'app-about',
    component:AboutComponent,  
    canActivate: [AuthGuard],   
    data: { state: 'app-about' }   
  },

  {
    path: 'app-expense-view/:id',
    component: ExpenseViewComponent,
    canActivate: [AuthGuard],
    data: { state: 'app-expense-view' }
  },
  {
    path:'app-signup',
    component:SignupComponent,      
    data: { state: 'app-signup' }  
  },  
  {
    path:'app-login',
    component:LoginComponent, 
    data: { state: 'app-login' }       
  },  
  
  {path: '404',  component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
