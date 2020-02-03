import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { AppSettings } from '../app-settings';
import { Router } from '@angular/router';
import { ExpenseDataService } from '../service/expense-data.service';
import { Expense } from '../data-model/expense.model';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { AlertDialog } from '../utils/alert-dialog';
// import { FingerPrintAuth } from 'capacitor-fingerprint-auth';
import { Plugins } from '@capacitor/core';

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
  alertRef: MatDialogRef<AlertDialog>;
  constructor(private fb: FormBuilder
    , private authService: AuthService
    , private router: Router
    , private expenseDataService: ExpenseDataService
    , public dialog: MatDialog
    , public snackBar: MatSnackBar
    )
     { }

  ngOnInit() {

    this.authService.isLoggedIn()
      .subscribe(response => {
        if(response){
          console.log('already logged in redirecting to app home');
          this.router.navigate(['/']);
        }

      });

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

        
        //touch id validation
        // const { FingerPrintAuth } = Plugins;

        // Plugins.FingerPrintAuthPlugin
        // .available()
        // .then(res => {
        //   console.log("res: ", res);
        //   if(res.has){
        //     Plugins.FingerPrintAuthPlugin.verify()
        //     .then(() => console.log("Biometric ID OK"))
        //     .catch(err => console.log(`Biometric ID NOT OK: ${JSON.stringify(err)}`));
        //   }
        // })
        

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
        this.loginStatusMessage = "Invalid email or password";

        this.alertRef = this.dialog.open(AlertDialog, {
          disableClose: false
        });
    
        this.alertRef.componentInstance.alertMessage = this.loginStatusMessage;

        this.snackBar.open(this.loginStatusMessage, null, {
          duration: 2000,
        });

      }

    })
  }

}
