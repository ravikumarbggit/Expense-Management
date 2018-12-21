import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { AppSettings } from '../app-settings';
import { Router } from '@angular/router';
import { ExpenseDataService } from '../service/expense-data.service';
import { Expense } from '../data-model/expense.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  localUser = {
    username: '',
    password: ''
  }
  loginStatusMessage: string;
  constructor(private fb: FormBuilder
    , private authService: AuthService
    , private router: Router
    , private expenseDataService: ExpenseDataService) { }

  ngOnInit() {

    this.initForm();
  }

  initForm() {
    this.localUser = {
      username: '',
      password: ''
    };

    this.loginForm = this.toFormGroup(this.localUser);
  }

  toFormGroup(localUser: any): FormGroup {
    const formGroup = this.fb.group({
      username: [localUser.username, Validators.required],
      password: [localUser.password, Validators.required]
    });
    return formGroup;
  }

  login(model: any){
    console.log('model: ', model);
    this.authService.login(model)
    .subscribe(response => {
      console.log(response);
      if(response){
        let token = response.username;
        let user = response;
        console.log('token :', token);
        console.log('userobj',user);
        this.authService.clearUserSpecificItems();
        if (token) {
            localStorage.setItem(AppSettings.LOCAL_STORAGE_CURRENT_USER, JSON.stringify({ user: response, token: token }));

        }
        console.log('login success');
        this.authService.setLoggedIn(true);
        this.expenseDataService.getJSON().subscribe(expense => {
          let userExpenses: Expense[] = expense.filter(r => r.userId === response.id );
          console.log('userExpenses: ',userExpenses);
          this.expenseDataService.pushExpenses(userExpenses);
          this.router.navigate(['/']);        
        });
         
      }
      else{
        console.log("Incorrect credentials...")
        this.loginStatusMessage = "Invalid username or password";
      }

    })
  }

}
