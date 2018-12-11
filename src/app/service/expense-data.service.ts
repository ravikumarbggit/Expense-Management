import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Expense } from '../data-model/expense.model';
import { User } from '../data-model/user.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseDataService {

  private expenseObjects = new BehaviorSubject<Expense[]>(null);
  // private currentUser: User;

  //private expenseData = this.expenseObjects.asObservable();

  constructor(private http: HttpClient) {
    // this.currentUser = this.userService.getCurrentUser();
  }

  getExpenses(): Observable<Expense[]> {
   
    console.log("this.expenseObjects.value: ", this.expenseObjects.value);
    // console.log("current user: ", this.currentUser);
    return this.expenseObjects
    // .pipe(
    //   map(exp => exp.filter(ex => ex.userId === this.currentUser.id ))
    // );
    // //
    .asObservable();
  
  }

  pushExpenses(inData: Expense[])  {
    console.log("inside push data", inData)
    this.expenseObjects.next(inData)    
  }

  public getJSON(): Observable<Expense[]> {
    return this.http.get<Expense[]>("./assets/data.json")
  }

  // public getExpenseById(id: number): Observable<Expense> {
  //   let retExpense: Observable<Expense>;
  //   this.http.get<Expense[]>("./assets/data.json")
  //   .
  //   .subscribe(exp => {
  //     retExpense.next(exp.find(ex => ex.id === id));
  //     //return retExpense;
  //   });

  //   return retExpense;
  // }

}
