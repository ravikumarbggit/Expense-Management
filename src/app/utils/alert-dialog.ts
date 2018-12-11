import { Component, Input } from '@angular/core';
//import { MdDialog, MdDialogRef } from '@angular/material';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';

@Component({
  selector: 'alert-dialog',
  templateUrl: './alert-dialog.html',
})
export class AlertDialog {
  constructor(public dialogRef: MatDialogRef<AlertDialog>) {}

  public alertMessage:string;
}