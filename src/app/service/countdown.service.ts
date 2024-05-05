import { Injectable } from '@angular/core';
import { Countdown } from '../interfaces/countdown';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {

  constructor() { }

  // FIXME: Countdown de prueba

  testCountdown: Countdown = {
    creationDate: new Date(),
    date: new Date(2024,6,22),
    id: 1,
    name: 'Contador de prueba',
    caption: 'Descripción de prueba para el primer contador de prueba de la historia del mundo mundial.',
  }

  private _countdowns: Countdown[] = [this.testCountdown]

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
}
