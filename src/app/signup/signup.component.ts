import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../data-model/user.model';
import { UsersService } from '../service/users.service';
import { take } from 'rxjs/operators';
import { MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { LocationService } from '../service/location.service';
import { LocationModel } from '../data-model/location.model';
import { CountryModel } from '../data-model/country.model';
import { AlertDialog } from '../utils/alert-dialog';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  existingUsers: User[] = [];
  confirmPassword = new FormControl(null);
  locationModel: LocationModel;
  alertRef: MatDialogRef<AlertDialog>;
  // currencies = [{
  //   symbol: "₹",
  //   text: "INR"
  // }, 
  // {
  //   symbol: "$",
  //   text: "USD"
  // }];

  countryList: CountryModel[] = [
    {
      id: "IN",
      name: "India",
      currency: "INR",
      currencyCode: "₹"
    },
    {
      id: "US",
      name: "United States of America",
      currency: "USD",
      currencyCode: "$"
    },
    {
      id: "AU",
      name: "Australia",
      currency: "AUD",
      currencyCode: "A$"
    },
    {
      id: "SG",
      name: "Singapore",
      currency: "SGD",
      currencyCode: "S$"
    },
    {
      id: "UK",
      name: "United Kingdom",
      currency: "GBP",
      currencyCode: "£"
    },
    {
      id: "EUR",
      name: "Europe",
      currency: "EUR",
      currencyCode: "€"
    },
    {
      id: "CN",
      name: "China",
      currency: "CNY",
      currencyCode: "¥"
    },
    {
      id: "JP",
      name: "Japan",
      currency: "JPY",
      currencyCode: "¥"
    },
  ]
  constructor(private fb: FormBuilder
  ,private usersService: UsersService
  , public snackBar: MatSnackBar
  , private router: Router
  , public dialog: MatDialog ) { }

  ngOnInit() {
    // this.getLocation()
    this.initForm();
    this.getExistingUsers();

    this.confirmPassword.valueChanges
    .subscribe(val => {
      if(val !== this.signupForm.get('password').value){
        //this.signupForm.controls['password'].setErrors({'incorrect': true});
        this.confirmPassword.setErrors({'incorrect': true})
      }else{
        // this.signupForm.controls['password'].setErrors(null);
        this.confirmPassword.setErrors(null)
      }
    })
  }

  initForm(){
    let user: User = {
      id: null,
      name: null,
      username: null,
      password: null,
      currency: null,
    }

    this.signupForm = this.toFormGroup(user);

  }

  toFormGroup(data: User): FormGroup{


    return this.fb.group({
      id: [data.id],
      name: [data.name,  Validators.compose([Validators.required, Validators.minLength(5)])],
      username: [data.username, Validators.compose([Validators.required, Validators.email, this.noWhitespaceValidator])],
      password: [data.password, Validators.compose([Validators.required, Validators.minLength(5), this.noWhitespaceValidator])],
      currency: [data.currency]
    })

  }

  getExistingUsers(){
    this.usersService.userData
    .pipe(
      take(1)
    )
    .subscribe(response => {
      this.existingUsers = response;
      console.log("this.existingUsers ", this.existingUsers)
    })
  }

  submit(model: User){


    if (!model.id) {
      let id: number = this.existingUsers.length > 0 ? Math.max.apply(Math, this.existingUsers.map(function (o) { return o.id; })) + 1 : 1;
      model.id = id;
    }
    console.log('model: ', model);
    this.existingUsers.push(model);
    this.usersService.pushUsers(this.existingUsers);

    this.snackBar.open("User "+ model.name +" Registered!", null, {
      duration: 2000,
    });

    this.router.navigate(['/']);

  }

  // getLocation(){
  //   this.locationService.getCountry()
  //   .subscribe(response => {
  //     console.log('location: ', response);
  //     this.locationModel = response;
  //     let currentCountry: CountryModel = this.countryList.find(cl => cl.id === response.country);
  //     console.log("currentCountry: ", currentCountry);
  //     if(currentCountry){
  //       this.signupForm.get('currency').patchValue(currentCountry.currencyCode);
  //     }
  //   })
  // }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0 || control.value.indexOf(' ') > 0 ;
    const isValid = !isWhitespace;
    console.log('isValid: ',isValid);
    return isValid ? null : { 'whitespace': true };
}

validateUsername(){
  let username = this.signupForm.controls['username'].value;
  let existingUser: User =  this.existingUsers.find(exu => exu.username === username);

  console.log("username: ", username);
  console.log("existingUser: ", existingUser);
  if(existingUser){
    
    
    this.alertRef = this.dialog.open(AlertDialog, {
      disableClose: false
    });

    this.alertRef.componentInstance.alertMessage = "Email already used";
    
    this.alertRef.afterClosed().subscribe(result => {
      this.signupForm.controls['username'].patchValue('');      
    })

    
  }
}

}


