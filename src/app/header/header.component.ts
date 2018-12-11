import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../data-model/user.model';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user:User;
  constructor(private authService: AuthService, private userService: UsersService) {
    
   }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    console.log('got user: ', this.user);
  }


  logout(){
    this.authService.logOut();
  }
}
