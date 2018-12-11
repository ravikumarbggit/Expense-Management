import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Expense, SelectEvent } from '../data-model/expense.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.scss']
})
export class ExpenseItemComponent implements OnInit {

  @Input() expense: Expense;
  @Input() changeCounter: number;  
  @Output() deleteEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() editEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() selectEvent: EventEmitter<SelectEvent> = new EventEmitter<SelectEvent>();
  displayedColumns: string[] = ['expenseHead'];

  selected = new FormControl(false);
  
  constructor() { }

  ngOnInit() {
    console.log('in HammerCardComponent ', this.expense);
    this.selected.patchValue(this.expense.isSelected);
    this.selected.valueChanges
    .subscribe(value => {
      let se: SelectEvent = {
        id: this.expense.id,
        selected: value
      }
      this.selectEvent.emit(se)
     }      
    )
  }

  ngOnChanges(){
    console.log('in HammerCardComponent on changes ', this.expense);
    this.selected.patchValue(this.expense.isSelected);
  }

  // animationState: string;

  // startAnimation(state, id:number) {
  //   console.log(state)
  //   if (!this.animationState) {
  //     this.animationState = state;
  //   }

  //   setTimeout(() => {
  //     if(state === 'zoomOutRight'){
  //       this.deleteEvent.emit(id);
  //     }
  //     if(state === 'slideOutLeft'){
  //       this.editEvent.emit(id);
  //     }
  //   }, 1200);

    
  // }

  // resetAnimationState() {
  //   this.animationState = '';
  // }

}
