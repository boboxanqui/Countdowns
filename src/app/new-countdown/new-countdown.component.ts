import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CountdownService } from '../service/countdown.service';
import { Countdown } from '../interfaces/countdown';

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
    private translate: TranslateService,
    private countdownService: CountdownService
  ) {  }

  ngOnInit(): void {
    
  }

  countdownForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    day: [ , Validators.required],
    // FIXME: fullDay needed?
    // fullDay: [true, Validators.required],
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

  submitted: boolean = false;

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
    if( input === 'minute' && this.getValue('minute') == 59){
      this.countdownForm.get('minute')?.setValue(0)
    }
    else if( input === 'hour' && this.getValue('hour') == 23){
      this.countdownForm.get('hour')?.setValue(0)
    } else{
      this.countdownForm.get(input)?.setValue( 
        this.getValue(input) +1
      )
    }
  }

  reduce( input: string ){
    if( input === 'minute' && this.getValue('minute') == 0){
      this.countdownForm.get('minute')?.setValue(59)
    }
    else if( input === 'hour' && this.getValue('hour') == 0){
      this.countdownForm.get('hour')?.setValue(23)
    } else{
      this.countdownForm.get(input)?.setValue( 
        this.getValue(input) -1
      )
    }
  }

  submit(){
    this.submitted = true
    if( !this.countdownForm.valid ) return

    let date:Date = new Date( this.getValue('day') )
    date.setHours( this.getValue('hour'), this.getValue('minute'))

    console.log(date);

    const newCountdown: Countdown = {
      date: date,
      creationDate: new Date(),
      id: this.countdownService.countdowns.length,
      name: this.getValue('name'),
      caption: this.getValue('caption')
    }

    this.countdownService.addCountdown(newCountdown)
    this.countdownForm.reset()
    this.submitted = false;
    this.dialogRef.close()
  }

  // fullDayChange( event: any ){
  //   if( this.getValue('fullDay') ){
  //     this.countdownForm.get('hour')?.reset(0)
  //     this.countdownForm.get('minute')?.reset(0)
  //     this.countdownForm.get('hour')?.disable();
  //     this.countdownForm.get('minute')?.disable();
  //     return
  //   }
    // this.countdownForm.get('hour')?.enable();
    // this.countdownForm.get('minute')?.enable();    
  // }

}
