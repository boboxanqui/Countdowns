import { Injectable } from '@angular/core';
import * as confetti from 'canvas-confetti';


@Injectable({
  providedIn: 'root'
})
export class CanvasConfettiService {

  constructor() { }

  confetti(id: string, duration: number) {
    const cardPosition = document.getElementById(id)?.getBoundingClientRect();
    const position = {
      y: (cardPosition?.top! + cardPosition?.height! / 2) / window.innerHeight,
      x: (cardPosition?.left! + cardPosition?.width! / 2) / window.innerWidth
    }
    let myCanvas = document.querySelector('canvas');
    let myConfetti = confetti.create(myCanvas!, {
      resize: true,
      useWorker: true
    })

    myConfetti({
      particleCount: 120,
      spread: 130,
      startVelocity: 30,
      gravity: 0.8,
      scalar: 0.8,
      origin: position,
      disableForReducedMotion: true,
    });

    setTimeout(() => myConfetti.reset(), duration);
  }

  sidesConfetti(duration: number) {
    const endTime = Date.now() + duration;

    let myCanvas = document.querySelector('canvas');

    // The CDK dialog overlay sits at z-index 1000, above the confetti
    // canvas's default (100). Raise it so bursts render over the dialog.
    if (myCanvas) {
      myCanvas.style.zIndex = '1001';
    }

    let myConfetti = confetti.create(myCanvas!, {
      resize: true,
      useWorker: true
    })

    function frame() {
      myConfetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      myConfetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < endTime) {
        requestAnimationFrame(frame);
      }
    }

    frame();
    setTimeout(() => myConfetti.reset(), duration);
  }



}
