import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-countdown',
  templateUrl: './new-countdown.component.html',
  styleUrls: ['./new-countdown.component.scss']
})
export class NewCountdownComponent implements OnInit {

  constructor( private dialogRef: MatDialogRef<NewCountdownComponent> ) { 
    this.dialogRef.addPanelClass('')
  }

  ngOnInit(): void {
  }

}
