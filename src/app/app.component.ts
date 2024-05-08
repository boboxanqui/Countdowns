import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewCountdownComponent } from './new-countdown/new-countdown.component';
import { CountdownService } from './service/countdown.service';
import { TimeLeft } from './interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private countdownService: CountdownService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('darkMode') === '1') {
      this.renderer.setAttribute(this.document.body, 'class', 'dark-theme')
    } else {
      this.renderer.setAttribute(this.document.body, 'class', 'light-theme')
    }

    this.countdowns.forEach( countdown => 
      countdown.timeLeft = countdown.date.getTime() - new Date().getTime()
    )

    this.startTimer()
  }

  timer: any;
  secondInMiliseconds:  number = 1000;
  minuteInMiliseconds:  number = 1000 * 60;
  hourInMiliseconds:    number = 1000 * 60 * 60;
  dayInMiliseconds:     number = 1000 * 60 * 60 * 24;
  yearInMiliseconds:    number = this.dayInMiliseconds * 365;
  centuryInMiliseconds: number = this.yearInMiliseconds * 100;



  // THEME TOGGLE
  switchTheme(isDark: boolean) {
    const theme = isDark ? 'dark-theme' : 'light-theme'
    this.renderer.setAttribute(this.document.body, 'class', theme)
    localStorage.setItem('darkMode', isDark === true ? '1' : '0')
  }

  // NEW COUNTDOWN
  openNewCountdownForm() {
    this.dialog.open(NewCountdownComponent, {
      width: '800px',
      panelClass: 'dialog-panel'
    })
  }

  // COUNTDOWNS LOGIC
  get countdowns() {
    return this.countdownService.countdowns
  }

  startTimer(){
    this.timer = setInterval( () =>{
      const now = new Date()
      this.countdowns.forEach( countdown => 
        countdown.timeLeft = countdown.date.getTime() - now.getTime()
      )
    }, 1000)
  }

  // TODO: New component for every countdown-card

  getTimeLeft( miliseconds: number | undefined ): TimeLeft | undefined {
    if(miliseconds){
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

  // getSecondsLeft( miliseconds: number | undefined ){
  //   return miliseconds

  // }

  // getDaysLeft(miliseconds: number | undefined){
  //   return miliseconds ? 
  //     Math.floor( miliseconds / this.dayInMiliseconds ) 
  //     : undefined
  // }

  // getYearsLeft( miliseconds: number | undefined ){
  //   return miliseconds ? 
  //     Math.floor( miliseconds / this.yearInMiliseconds ) :
  //     undefined
  // }
}