import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CountdownService } from '../service/countdown.service';
import { Countdown, COUNTDOWN_COLORS, COUNTDOWN_ICONS, COUNTDOWN_RECURRENCES } from '../interfaces';

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
    private countdownService: CountdownService,
    @Inject(MAT_DIALOG_DATA) public countdown: Countdown
  ) {  }

  ngOnInit(): void {
    if(this.countdown){
      this.editMode = true;
      this.setValue( 'name', this.countdown.name );
      this.setValue( 'day', this.countdown.date );
      this.setValue( 'hour', this.countdown.date.getHours() );
      this.setValue( 'minute', this.countdown.date.getMinutes() );
      this.setValue( 'caption', this.countdown.caption )
      this.setValue( 'color', this.countdown.color ?? '' )
      this.setValue( 'icon', this.countdown.icon ?? '' )
      this.setValue( 'recurrence', this.countdown.recurrence ?? 'none' )
    }
  }

  colors = COUNTDOWN_COLORS
  icons = COUNTDOWN_ICONS
  recurrences = COUNTDOWN_RECURRENCES

  countdownForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(40)]],
    day: [ , Validators.required],
    hour: [ 0, [Validators.min(0), 
              Validators.max(23), 
              Validators.maxLength(2)]
            ],
    minute: [ 0, [Validators.min(0), 
                Validators.max(59), 
                Validators.maxLength(2)]
              ],
    caption: ['', Validators.maxLength(300)],
    color: [''],
    icon: [''],
    recurrence: ['none']
  })

  submitted: boolean = false;
  editMode: boolean = false;
  yesterday = new Date();

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

  setValue( input: string, value: any ){
    this.countdownForm.controls[input].setValue( value )
  }

  isValid( input: string ): boolean{
    return this.countdownForm.controls[input].valid
  }

  getError( input: string ) {
    return this.countdownForm.controls[input].errors
  }

  selectColor( color: string ){
    this.setValue( 'color', color )
  }

  selectIcon( icon: string ){
    this.setValue( 'icon', icon )
  }

  selectRecurrence( recurrence: string ){
    this.setValue( 'recurrence', recurrence )
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

    const newCountdown: Countdown = {
      date: date,
      creationDate: new Date(),
      id: this.countdownService.countdowns.length +1,
      name: this.getValue('name'),
      caption: this.getValue('caption'),
      color: this.getValue('color'),
      icon: this.getValue('icon'),
      recurrence: this.getValue('recurrence'),
      closed: false,
      removed: false
    }

    this.countdownService.addCountdown(newCountdown)
    this.countdownForm.reset()
    this.submitted = false;
    this.dialogRef.close()
  }

  edit(){
    this.submitted = true
    if( !this.countdownForm.valid ) return

    let date:Date = new Date( this.getValue('day') )
    date.setHours( this.getValue('hour'), this.getValue('minute'))

    const newCountdown: Countdown = {
      date: date,
      creationDate: this.countdown.creationDate,
      id: this.countdown.id,
      name: this.getValue('name'),
      caption: this.getValue('caption'),
      color: this.getValue('color'),
      icon: this.getValue('icon'),
      recurrence: this.getValue('recurrence'),
      lastUpdate: new Date(),
      closed: this.countdown.closed,
      removed: this.countdown.removed
    }

    this.countdownService.editCountdown(this.countdown, newCountdown)
    this.countdownForm.reset()
    this.submitted = false;
    this.dialogRef.close()

  }

}
