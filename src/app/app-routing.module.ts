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
    data: { state: '1' }
  },
  {
    path: 'app-expense/:id',
    canActivate: [AuthGuard],
    component: ExpenseComponent,
    data: { state: '2' }
  },
  {
    path: 'app-expense',
    canActivate: [AuthGuard],
    component: ExpenseComponent,
    data: { state: '3' }
  }, 
  {
    path:'app-about',
    component:AboutComponent,  
    canActivate: [AuthGuard],   
    data: { state: '4' }   
  },

  {
    path: 'app-expense-view/:id',
    component: ExpenseViewComponent,
    canActivate: [AuthGuard],
    data: { state: '5' }
  },
  {
    path:'app-signup',
    component:SignupComponent,      
    data: { state: '6' }  
  },  
  {
    path:'app-login',
    component:LoginComponent, 
    data: { state: '7' }       
  },  
  
  {path: '404',  component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
