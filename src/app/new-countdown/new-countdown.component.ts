import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-countdown',
  templateUrl: './new-countdown.component.html',
  styleUrls: ['./new-countdown.component.scss']
})
export class NewCountdownComponent  {

  constructor( private dialogRef: MatDialogRef<NewCountdownComponent> ) { 
   
  }


}
