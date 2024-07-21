import { Component, Inject } from '@angular/core';
import { Countdown, TimeLeft } from '../interfaces';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-countdown-dialog',
  templateUrl: './countdown-dialog.component.html',
  styles: [
  ]
})
export class CountdownDialogComponent {

  constructor(
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public countdown: Countdown
  ) { }

  secondInMiliseconds:  number = 1000;
  minuteInMiliseconds:  number = 1000 * 60;
  hourInMiliseconds:    number = 1000 * 60 * 60;
  dayInMiliseconds:     number = 1000 * 60 * 60 * 24;
  yearInMiliseconds:    number = this.dayInMiliseconds * 365;
  centuryInMiliseconds: number = this.yearInMiliseconds * 100;

  getTimeLeft( miliseconds: number | undefined ): TimeLeft | undefined {
    if(miliseconds === 0){
      return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
    } else if(miliseconds){
      let milisecondsLeft = miliseconds
      const years = Math.floor( milisecondsLeft / this.yearInMiliseconds );
      milisecondsLeft -= years * this.yearInMiliseconds;
      const days = Math.floor( milisecondsLeft / this.dayInMiliseconds );
      milisecondsLeft -= days * this.dayInMiliseconds;
      const hours = Math.floor( milisecondsLeft / this.hourInMiliseconds );
      milisecondsLeft -= hours * this.hourInMiliseconds;
      const minutes = Math.floor( milisecondsLeft / this.minuteInMiliseconds );
      milisecondsLeft -= minutes * this.minuteInMiliseconds;
      const seconds = Math.floor( milisecondsLeft / this.secondInMiliseconds );

      return { years, days, hours, minutes, seconds }
    }
    return undefined
  }

  get currentLang() {
    return this.translate.currentLang
  }

}
