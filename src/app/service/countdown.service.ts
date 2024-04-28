import { Injectable } from '@angular/core';
import { Countdown } from '../interfaces/countdown';
import { Observable, Subject, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {

  constructor() { }

  private _countdowns: Countdown[] = []

  get countdowns$(): Observable<Countdown[]>{
    return of(this._countdowns)
  }

  addCountdown(newCountdown: Countdown){
    this._countdowns.push( newCountdown )
  }

  removeCountdown( countdown: Countdown ){
    this._countdowns.splice(
      this._countdowns.indexOf(countdown),
      1
    )
  }
}
