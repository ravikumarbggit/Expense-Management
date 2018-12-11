import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Expense, SelectEvent } from '../data-model/expense.model';

import { trigger, keyframes, animate, transition } from '@angular/animations';
import * as kf from '../keyframes';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-hammer-card',
  templateUrl: './hammer-card.component.html',
  styleUrls: ['./hammer-card.component.scss'],
  animations: [
    trigger('cardAnimator', [
      transition('* => wobble', animate(1000, keyframes(kf.wobble))),
      transition('* => swing', animate(1000, keyframes(kf.swing))),
      transition('* => jello', animate(1000, keyframes(kf.jello))),
      transition('* => zoomOutRight', animate(1000, keyframes(kf.zoomOutRight))),
      transition('* => slideOutLeft', animate(1000, keyframes(kf.slideOutLeft))),
      transition('* => rotateOutUpRight', animate(1000, keyframes(kf.rotateOutUpRight))),
      transition('* => flipOutY', animate(1000, keyframes(kf.flipOutY))),
    ])
  ]
})
export class HammerCardComponent implements OnInit, OnChanges {

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

  animationState: string;

  startAnimation(state, id:number) {
    console.log(state)
    if (!this.animationState) {
      this.animationState = state;
    }

    setTimeout(() => {
      if(state === 'zoomOutRight'){
        this.deleteEvent.emit(id);
      }
      if(state === 'slideOutLeft'){
        this.editEvent.emit(id);
      }
    }, 1200);

    
  }

  resetAnimationState() {
    this.animationState = '';
  }

}

