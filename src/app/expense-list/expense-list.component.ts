import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Expense, SelectEvent } from '../data-model/expense.model';
import { ExpenseDataService } from '../service/expense-data.service';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatDialogRef, MatDialog, MatSidenav } from '@angular/material';
import { ConfirmationDialog } from '../utils/confirmation-dialog';
import { Router, NavigationStart } from '@angular/router';
import { CdkDragDrop, CdkDragEnd, CdkDrag } from '@angular/cdk/drag-drop';
import { SidenavService } from '../service/sidenav.service';
import { User } from '../data-model/user.model';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {

  @ViewChild('sidenavIndex') public sideNav:MatSidenav;
  //expense$: Observable<Expense[]>
  user:User;
  expenses: Expense[] = [];
  selectAll: boolean = false;
  selected: boolean = false;
  selectAllControl = new FormControl(false);
  changeCounter: number = 0;
  dialogRef: MatDialogRef<ConfirmationDialog>;
  visible: boolean[] = [];
  displayEditButton: boolean = true;
  // displayDeleteButton: boolean = true;

  constructor(private expenseDataService: ExpenseDataService
    , public snackBar: MatSnackBar
    , private dialog: MatDialog
    , private router: Router
    , private sideNavService: SidenavService
    , private userService: UsersService) { 



    }

  ngOnInit() {
    //this.expense$ = this.expenseDataService.getJSON();
    //this.expense$ = this.expenseDataService.getExpenses();
    this.user = this.userService.getCurrentUser();
    
    this.expenseDataService.getExpenses().subscribe(response => {
      this.expenses = response;
      if (this.expenses) {
        this.expenses.forEach(exp => {
          this.visible.push(false);
        })
      }
    })

    this.selectAllControl.valueChanges
      .subscribe(value => {
        this.selectAll = value;
        let tempExpenses: Expense[] = [...this.expenses];
        this.expenses = [];
        tempExpenses.forEach(exp => {
          exp.isSelected = value;
          this.expenses.push(exp);
        });
        this.changeCounter++;
      }
      )


      this.sideNavService.setSidenav(this.sideNav);

      this.router.events
        .subscribe(event => {
          if (event instanceof NavigationStart) {
            this.sideNavService.close().then(() => { });
          }
        });
  }

  deleteExpense(id: number) {

    let deleteExpense: Expense = this.expenses.find(exp => exp.id === id);
    this.expenses = this.expenses.filter(item => item != deleteExpense);
    this.expenseDataService.pushExpenses(this.expenses);
    this.snackBar.open("Deleted!", "x", {
      duration: 5000,
    });
  }

  selectExpense(selected: SelectEvent) {
    console.log("selected: ", selected);
    this.expenses.forEach(exp => {
      if (exp.id === selected.id) {
        exp.isSelected = selected.selected;
      }
    });

    console.log("this.expenses: ", this.expenses);
    let selectCount: number = this.expenses.filter(exp => exp.isSelected).length;
    if (selectCount) {

      setTimeout(() => {
        this.selected = true;
      }, );

    } else {

      setTimeout(() => {
        this.selected = false;
      }, );

    }
  }

  displayAdd(): boolean {
    return !this.selectAll && !this.selected;
  }

  displayDelete(): boolean {
    return this.selectAll || this.selected
  }

  deleteSelected() {

    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false
    });

    this.dialogRef.componentInstance.confirmMessage = "Do you really want to delete?"

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.expenses = this.expenses.filter(exp => !exp.isSelected);
        this.selectAll = false;
        this.selected = false;
        this.expenseDataService.pushExpenses(this.expenses);
        this.snackBar.open("Deleted!", null, {
          duration: 2000,
        });
      }
    })
  }

  editExpense(id: number) {
    this.router.navigate(['/app-expense', id]);
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event, event.previousIndex);
    console.log(this.expenses[event.previousIndex])
    this.deleteExpense(this.expenses[event.previousIndex].id)
    this.visible.splice(event.previousIndex, 1);

  }



  dragEnded(event: any, i: number){
    console.log('ended: ', event);
    


    if(event.source._activeTransform.x < 0 && Math.abs(event.source._activeTransform.x) > event.source.element.nativeElement.clientWidth/2 ){
      console.log("DELETE NOW");
      this.deleteExpense(this.expenses[i].id)
    }else
    if(event.source._activeTransform.x > 0 && Math.abs(event.source._activeTransform.x) > event.source.element.nativeElement.clientWidth/2 ){
      console.log("EDIT NOW");
      this.editExpense(this.expenses[i].id)
    }else{

      event.source.element.nativeElement.style.transform = 'none' // visually reset element to its origin
      const source: any = event.source
      source._passiveTransform = { x: 0, y: 0 } // make it so new drag starts from same origin

    }

   
  }


  viewExpense(expense: Expense){
    console.log('expense click: ', expense);
    this.router.navigate(['/app-expense-view', expense.id]);
  }

}
