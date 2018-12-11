import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseComponent } from './expense/expense.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { AboutComponent } from './about/about.component';
import { SignupComponent } from './signup/signup.component';
import { ExpenseViewComponent } from './expense-view/expense-view.component';


const routes: Routes = [

  // {
  //   path: '',
  //   canActivate: [AuthGuard],
  //   component: AppLayoutComponent,
  //   children:[
  //     {        
  //       path: '', component: ExpenseListComponent
  //     },
  //     {
  //       path: 'app-expense/:id',
  //       canActivate: [AuthGuard],
  //       component: ExpenseComponent
  //     },
  //     {
  //       path: 'app-expense',
  //       canActivate: [AuthGuard],
  //       component: ExpenseComponent
  //     }, 
  //     {
  //       path:'app-about',
  //       component:AboutComponent,        
  //     },

  //     {
  //       path: 'app-expense-view/:id',
  //       component: ExpenseViewComponent,
  //     }
  //   ]
  // },
  {        
    path: '', component: ExpenseListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'app-expense/:id',
    canActivate: [AuthGuard],
    component: ExpenseComponent
  },
  {
    path: 'app-expense',
    canActivate: [AuthGuard],
    component: ExpenseComponent
  }, 
  {
    path:'app-about',
    component:AboutComponent,  
    canActivate: [AuthGuard],      
  },

  {
    path: 'app-expense-view/:id',
    component: ExpenseViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'app-signup',
    component:SignupComponent,        
  },  
  {
    path:'app-login',
    component:LoginComponent,        
  },  
  
  {path: '404',  component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
