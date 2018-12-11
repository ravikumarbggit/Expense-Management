import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../data-model/user.model';
import { UsersService } from '../service/users.service';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  existingUsers: User[] = [];
  confirmPassword = new FormControl('');

  currencies = [{
    symbol: "₹",
    text: "INR"
  }, 
  {
    symbol: "$",
    text: "USD"
  }];

  constructor(private fb: FormBuilder
  ,private usersService: UsersService
  , public snackBar: MatSnackBar
  , private router: Router) { }

  ngOnInit() {
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
      username: [data.username, Validators.compose([Validators.required, Validators.minLength(5)])],
      password: [data.password, Validators.compose([Validators.required, Validators.minLength(5)])],
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

}
