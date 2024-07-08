import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CountdownDialogComponent } from 'src/app/countdown-dialog/countdown-dialog.component';
import { Countdown, TimeLeft } from 'src/app/interfaces';
import { NewCountdownComponent } from 'src/app/new-countdown/new-countdown.component';
import { CountdownService } from 'src/app/service/countdown.service';

@Component({
  selector: 'countdown-card',
  templateUrl: './countdown-card.component.html',
  styleUrls: ['./countdown-card.component.scss']
})
export class CountdownCardComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private countdownService: CountdownService
  ) { }


  ngOnInit(): void {
  }

  @Input() countdown!: Countdown

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

  editCountdown(){
    this.dialog.open( NewCountdownComponent, {
      data: this.countdown,
      width: '800px',
      panelClass: 'dialog-panel',
      backdropClass: 'dialog-backdrop',
    })
  }

  openCountdownDialog(){
    this.dialog.open( CountdownDialogComponent, {
      data: this.countdown,
      width: '800px',
      panelClass: 'dialog-panel',
      backdropClass: 'dialog-backdrop',
    })
  }

  deleteCountdown(){
    this.countdownService.removeCountdown(
      this.countdown
    )
  }

}
