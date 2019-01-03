import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Location } from '@angular/common';
import { Expense } from '../data-model/expense.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExpenseDataService } from '../service/expense-data.service';

@Component({
  selector: 'app-expense-view',
  templateUrl: './expense-view.component.html',
  styleUrls: ['./expense-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseViewComponent implements OnInit, OnDestroy {

  expense: Expense;
  private paramSub: Subscription;
  onDestroy: Subject<boolean> = new Subject();

  constructor(private route: ActivatedRoute
  ,private expenseDataService: ExpenseDataService
  , private _location: Location) { }
  

  ngOnInit() {

    this.getExpenseDetail();

  }


  ngOnDestroy() {
    console.log('ngOnDestory');
    this.onDestroy.next(true);
    this.onDestroy.complete();
    this.paramSub.unsubscribe();
  }

  getExpenseDetail() {
    this.paramSub = this.route.params
      .pipe(
        takeUntil(this.onDestroy)
      )
      .subscribe(params => {
        console.log("params['id']: " + params['id']);
        if (params['id']) {
          this.expenseDataService.getExpenses()
          .subscribe(response => {
              console.log('response: ', response);
              if(response){
                this.expense = response.find(exp => exp.id === +params['id'] )
                console.log('found expense: ', this.expense);
              }
            })
        }

      });

  }

  goBack(){
    this._location.back();
  }

}
