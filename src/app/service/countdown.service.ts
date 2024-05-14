import { Injectable } from '@angular/core';
import { Countdown } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {

  constructor() { }

  // FIXME: Countdown de prueba

  testCountdowns = [
    {
      creationDate: new Date(),
      date: new Date(2025,4,7,20,10),
      id: 1,
      name: 'Contador de prueba',
      caption: 'Descripción de prueba para el primer contador de prueba de la historia del mundo mundial.',
      timeLeft: 0
    },
    {
      creationDate: new Date(),
      date: new Date(3016,6,22,13,13),
      id: 2,
      name: 'Contador de prueba 2',
      caption: 'Descripción de prueba para el primer contador de prueba de la historia del mundo mundial.',
      timeLeft: 0
    },
    {
      creationDate: new Date(),
      date: new Date(2024,11,25,0,0),
      id: 1,
      name: 'Contador de prueba XMAS',
      caption: 'Descripción de prueba para el primer contador de prueba de la historia del mundo mundial.',
      timeLeft: 0
    },

  ]


  private _countdowns: Countdown[] = [...this.testCountdowns]

  get countdowns():Countdown[]{
    return this._countdowns
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

  editCountdown( oldCountdown: Countdown, newCountdown: Countdown ){
    this.countdowns.splice(
      this.countdowns.indexOf( oldCountdown ),
      1,
      newCountdown
    ) 
  }
}
