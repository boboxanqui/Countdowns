import { Injectable } from '@angular/core';
import * as confetti from 'canvas-confetti';


@Injectable({
  providedIn: 'root'
})
export class CanvasConfettiService {

  constructor() { }

  confetti(id:string, duration: number){
    const cardPosition = document.getElementById(id)?.getBoundingClientRect();
    const position = {
      y: (cardPosition?.top! + cardPosition?.height!/2 ) / window.innerHeight,
      x: (cardPosition?.left! + cardPosition?.width!/2 ) / window.innerWidth
    }
    let myCanvas = document.querySelector('canvas');
    let myConfetti = confetti.create(myCanvas!,{
      resize: true,
      useWorker: true
    })

    myConfetti({
      particleCount: 120,
      spread: 130,
      startVelocity:30,
      gravity: 0.8,
      scalar:0.8,
      origin: position,
      disableForReducedMotion: true,
    });

   setTimeout(() => myConfetti.reset(), duration);
  }

}
