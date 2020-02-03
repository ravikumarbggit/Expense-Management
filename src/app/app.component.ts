import { Component, ViewChild, OnInit } from '@angular/core';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { ExpenseDataService } from './service/expense-data.service';
import { MatSidenav } from '@angular/material';
import { Router, NavigationStart, RouterOutlet } from '@angular/router';
import { SidenavService } from './service/sidenav.service';
import { UsersService } from './service/users.service';
import { User } from './data-model/user.model';
import { take } from 'rxjs/operators';
import { Expense } from './data-model/expense.model';
import { Meta } from '@angular/platform-browser';
// import {registerWebPlugin} from "@capacitor/core";
// import { FingerPrintAuth } from 'capacitor-fingerprint-auth';

// export const routerTransition = trigger('routerTransition', [
//   transition('* <=> *', [
//     /* order */
//     /* 1 */ query(':enter, :leave', style({ position: 'fixed', width: '100%' })
//       , { optional: true }),
//     /* 2 */ group([  // block executes in parallel
//       query(':enter', [
//         style({ transform: 'translateX(100%)' }),
//         animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
//       ], { optional: true }),
//       query(':leave', [
//         style({ transform: 'translateX(0%)' }),
//         animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
//       ], { optional: true }),
//     ])
//   ])
// ])

export const routerTransition = trigger('routerTransition', [
// LEFT TO RIGHT AKA PREVIOUS
transition('* => 1', [
  // Initial state of new route
  query(':enter',
    style({
      position: 'fixed',
      width: '100%',
      transform: 'translateX(-100%)'
    }), { optional: true }),
  // move page off screen right on leave
  // query(':leave',
  //   animate('300ms ease',
  //     style({
  //       position: 'fixed',
  //       width: '100%',
  //       transform: 'translateX(100%)',
  //     })
  //   ), { optional: true }),
  // move page in screen from left to right
  query(':enter',
    animate('500ms ease',
      style({
        opacity: 1,
        transform: 'translateX(0%)'
      })
    ), { optional: true }),
]),

// RIGHT TO LEFT
transition('1 => *', [
  // Initial state of new route
  query(':enter',
    style({
      position: 'fixed',
      width: '100%',
      transform: 'translateX(100%)'
    }), { optional: true }),
  // move page off screen right on leave
  // query(':leave',
  //   animate('300ms ease',
  //     style({
  //       position: 'fixed',
  //       width: '100%',
  //       transform: 'translateX(100%)',
  //     })
  //   ), { optional: true }),
  // move page in screen from left to right
  query(':enter',
    animate('500ms ease',
      style({
        opacity: 1,
        transform: 'translateX(0%)'
      })
    ), { optional: true }),
]),
])

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit {

  constructor(private usersService: UsersService
    , private expenseDataService: ExpenseDataService
    , private meta: Meta
    ) {

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

    // this.meta.addTag({ name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' });
    this.meta.updateTag(
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      `name='viewport'`
    );

  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  ngOnInit(){

    // registerWebPlugin(FingerPrintAuth);
  }


}
