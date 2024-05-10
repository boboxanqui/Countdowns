import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Countdown, TimeLeft } from 'src/app/interfaces';

@Component({
  selector: 'countdown-card',
  templateUrl: './countdown-card.component.html',
  styleUrls: ['./countdown-card.component.scss']
})
export class CountdownCardComponent implements OnInit {

  constructor(private translate: TranslateService) { }


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

  get currentLang() {
    return this.translate.currentLang
  }

}
