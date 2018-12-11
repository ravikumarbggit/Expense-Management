import { Component, ViewChild, OnInit } from '@angular/core';
import { ExpenseDataService } from './service/expense-data.service';
import { MatSidenav } from '@angular/material';
import { Router, NavigationStart } from '@angular/router';
import { SidenavService } from './service/sidenav.service';
import { UsersService } from './service/users.service';
import { User } from './data-model/user.model';
import { take } from 'rxjs/operators';
import { Expense } from './data-model/expense.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private usersService: UsersService, private expenseDataService: ExpenseDataService) {

    this.usersService.getJSON().subscribe(response => {
      this.usersService.pushUsers(response);

      let currentUser: User = this.usersService.getCurrentUser();

      if (currentUser) {
        this.expenseDataService.getExpenses()
          .pipe(
            take(1)
          )
          .subscribe(response => {
            if (!response || response.length === 0) {
              this.expenseDataService.getJSON().subscribe(expense => {
                let userExpenses: Expense[] = expense.filter(r => r.userId === currentUser.id);
                console.log('userExpenses: ', userExpenses);
                this.expenseDataService.pushExpenses(userExpenses);
              });
            }
          })
      }
    })


  }

}
