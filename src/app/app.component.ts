import { Component, ViewChild, OnInit} from '@angular/core';
import { ExpenseDataService } from './service/expense-data.service';
import { MatSidenav } from '@angular/material';
import { Router, NavigationStart } from '@angular/router';
import { SidenavService } from './service/sidenav.service';
import { UsersService } from './service/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private expenseDataService: ExpenseDataService
  ,private usersService: UsersService){
  this.expenseDataService.getJSON().subscribe(response => {
    this.expenseDataService.pushExpenses(response);
  });

  this.usersService.getJSON().subscribe(response => {
    this.usersService.pushUsers(response);
  })

}
 
}
