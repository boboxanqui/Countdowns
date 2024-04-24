import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-new-countdown',
  templateUrl: './new-countdown.component.html',
  styleUrls: ['./new-countdown.component.scss']
})
export class NewCountdownComponent implements OnInit {

  // TODO: date format up to language
  // TODO: 2digits Pipe on Hour & Minute inputs

  constructor( 
    private dialogRef: MatDialogRef<NewCountdownComponent>,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {  }

  ngOnInit(): void {
    this.countdownForm.controls['minute'].disable();
    this.countdownForm.controls['hour'].disable();
    console.log( this.getLang() );
    
  }

  countdownForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    day: [ , Validators.required],
    fullDay: [true, Validators.required],
    hour: [ 0, [Validators.min(0), 
              Validators.max(23), 
              Validators.maxLength(2)]
            ],
    minute: [ 0, [Validators.min(0), 
                Validators.max(59), 
                Validators.maxLength(2)]
              ],
    caption: ['']
  })

  // Current Language 
  getLang(){
    return this.translate.currentLang
  }

  // Filter Dates
  filterDates(d: Date | null): boolean {
    const today = new Date();
    return (d || new Date()).getTime() - today.getTime() > 0 ? true : false
  }

  // VALUE FORMS
  getValue( input: string ){
    return this.countdownForm.get(input)?.value
  }

  isValid( input: string ): boolean{
    return this.countdownForm.controls[input].valid
  }

  getError( input: string ) {
    return this.countdownForm.controls[input].errors
  }

  increase( input: string ){
    this.countdownForm.get(input)?.setValue( 
      this.getValue(input) +1
    )
    if( !this.isValid(input) ){
      this.countdownForm.get(input)?.setValue( 
        this.getValue(input) -1
      )
    }
  }

  reduce( input: string ){
    this.countdownForm.get(input)?.setValue( 
      this.getValue(input) -1
    )
    if( !this.isValid(input) ){
      this.countdownForm.get(input)?.setValue( 
        this.getValue(input) +1
      )
    }
  }

  fullDayChange( event: any ){
    if( this.getValue('fullDay') ){
      this.countdownForm.get('hour')?.reset(0)
      this.countdownForm.get('minute')?.reset(0)
      this.countdownForm.get('hour')?.disable();
      this.countdownForm.get('minute')?.disable();
      return
    }
    this.countdownForm.get('hour')?.enable();
    this.countdownForm.get('minute')?.enable();    
  }

}
