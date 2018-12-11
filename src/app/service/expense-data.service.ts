import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Expense } from '../data-model/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseDataService {

  private expenseObjects = new BehaviorSubject<Expense[]>(null);

  expenseData = this.expenseObjects.asObservable();

  constructor(private http: HttpClient) {

  }

  // getExpenses(): Observable<Expense[]> {
   
  //   console.log("this.expenseObjects.value: ", this.expenseObjects.value);
  //   return this.expenseObjects.asObservable();
  
  // }

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
