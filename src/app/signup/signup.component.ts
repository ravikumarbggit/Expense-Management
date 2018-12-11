import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  constructor(private fb: FormBuilder
  ,private usersService: UsersService
  , public snackBar: MatSnackBar
  , private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.getExistingUsers();
  }

  initForm(){
    let user: User = {
      name: null,
      username: null,
      password: null,
    }

    this.signupForm = this.toFormGroup(user);

  }

  toFormGroup(data: User): FormGroup{


    return this.fb.group({
      name: [data.name,  Validators.compose([Validators.required, Validators.minLength(5)])],
      username: [data.username, Validators.compose([Validators.required, Validators.minLength(5)])],
      password: [data.password, Validators.compose([Validators.required, Validators.minLength(5)])]
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
    console.log('model: ', model);
    this.existingUsers.push(model);
    this.usersService.pushUsers(this.existingUsers);

    this.snackBar.open("User "+ model.name +" Registered!", null, {
      duration: 2000,
    });

    this.router.navigate(['/']);

  }

}
