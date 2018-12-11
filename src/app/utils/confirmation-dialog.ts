import { Component, Input } from '@angular/core';
//import { MdDialog, MdDialogRef } from '@angular/material';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirmation-dialog.html',
})
export class ConfirmationDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialog>) {}

  public confirmMessage:string;
}