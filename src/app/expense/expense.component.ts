import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Expense } from '../data-model/expense.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ExpenseDataService } from '../service/expense-data.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../data-model/user.model';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit, OnDestroy {

  public expenseForm: FormGroup
  datePipe = new DatePipe('en-US');
  //defaultCurrency: string = "INR";
  currencies = [{
    symbol: "₹",
    text: "INR"
  }, 
  {
    symbol: "$",
    text: "USD"
  }];
  expenseCategories: string[] = ["Personal", "Business", "Miscellaneous"]
  expenses: Expense[] = [];
  onDestroy: Subject<boolean> = new Subject();
  private paramSub: Subscription;
  currentUser: User;

  constructor(private fb: FormBuilder
    , private expenseDataService: ExpenseDataService
    , public snackBar: MatSnackBar
    , private route: ActivatedRoute
    , private router: Router
    , private userService: UsersService) { }

  ngOnInit() {

    this.currentUser = this.userService.getCurrentUser();
    this.getExpenses();


    console.log('this.currentUser: ',this.currentUser);
  }

  ngOnDestroy() {
    console.log('ngOnDestory');
    this.onDestroy.next(true);
    this.onDestroy.complete();
    this.paramSub.unsubscribe();
  }

  initForm() {

    let data: Expense = {
      id: null,
      userId: null,
      date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      expenseHead: null,
      amount: null,
      currency: this.currentUser ? this.currentUser.currency : null,
      expenseCategory: null,
      isRecurring: null,
      isSelected: null,
      details: null,
    }

    this.expenseForm = this.toFormGroup(data);

  }

  toFormGroup(data: Expense): FormGroup {

    const formGroup = this.fb.group({
      id: [data.id],
      userId: [data.userId],
      date: [this.datePipe.transform(data.date, 'yyyy-MM-dd'), Validators.required],
      expenseHead: [data.expenseHead, Validators.required],
      amount: [data.amount, [Validators.required, Validators.pattern(/^[.\d]+$/)]],
      currency: [data.currency, Validators.required],
      expenseCategory: [data.expenseCategory],
      isRecurring: [data.isRecurring],
      details: [data.details]
    });

    return formGroup;

  }

  getExpenses() {
    this.expenseDataService.getExpenses()
      .subscribe(response => {
        this.expenses = response;
        if (this.expenses)
          this.getExpenseDetail();
      })
  }

  onSubmit(model: Expense) {

    if (this.expenseForm.valid) {

      if (!model.id) {
        let id: number = this.expenses.length > 0 ? Math.max.apply(Math, this.expenses.map(function (o) { return o.id; })) + 1 : 1;
        model.id = id;
      }

      console.log("in submit: ", model)

      if(this.expenses.find(exp => exp.id === model.id)){
        this.expenses.forEach(exp => {
          if(exp.id === model.id){
            exp.amount = model.amount;
            exp.currency = model.currency;
            exp.date = this.datePipe.transform(model.date, 'yyyy-MM-dd');
            exp.details = model.details;
            exp.expenseCategory = model.expenseCategory;
            exp.expenseHead = model.expenseHead;
            exp.isRecurring = model.isRecurring;
            exp.isSelected = model.isSelected;
          }
        })
      }else{
        this.expenses.push(model)
      }

      
      this.expenseDataService.pushExpenses(this.expenses);

      this.snackBar.open("Saved!", null, {
        duration: 2000,
      });

      this.router.navigate(['/']);

    } else {
      console.log("Form not vaid");
    }
  }

  getExpenseDetail() {
    this.paramSub = this.route.params
      .pipe(
        takeUntil(this.onDestroy)
      )
      .subscribe(params => {
        console.log("params['id']: " + params['id']);
        if (params['id']) {
          let expenseFromRoute: Expense = this.expenses.find(exp => exp.id === +params['id']);
          console.log("expenseFromRoute: ", expenseFromRoute);
          if (expenseFromRoute)
            this.expenseForm = this.toFormGroup(expenseFromRoute);
        }
        else {
          this.initForm();
        }

      });

  }

}
