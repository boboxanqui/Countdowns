import { Injectable } from '@angular/core';
import { Countdown, CountdownFirestore } from '../interfaces';
import { Firestore, collection, collectionData, setDoc, getDocs, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { DocumentData, DocumentSnapshot } from 'rxfire/firestore/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  private _countdowns: Countdown[] = []

  get countdowns(): Countdown[] {
    return this._countdowns
  }

  setCountdowns(countdowns: Countdown[]) {
    this._countdowns = [...countdowns]
  }

  // GETTERS FIRESTORE
  get countdownsFirestore() {
    const firestorRef = collection(this.firestore, 'userUID', this.authService.userData.UID!, 'countdowns')
    return getDocs(firestorRef)
  }

  getFirestoreDocs(userUID: string) {
    const firestorRef = collection(this.firestore, 'userUID', userUID)
    return collectionData(firestorRef)
  }

  getCollection(userUID: string): Observable<CountdownFirestore[]> {
    const firestorRef = collection(this.firestore, 'userUID', userUID, 'countdowns')
    return collectionData(firestorRef, { idField: 'id' }) as Observable<any>

  }

  addCountdown(newCountdown: Countdown) {
    if (this.authService.userData.active) {
      const docRef = doc(
        this.firestore,
        'userUID', this.authService.userData.UID!,
        'countdowns', newCountdown.id.toString()
      );
      setDoc(docRef, newCountdown)
        .then(console.log)
        .catch(err => console.error(err))
    }
    this._countdowns.push(newCountdown)
  }

  removeCountdown(countdown: Countdown) {
    if (this.authService.userData.active) {
      const docRef = doc(
        this.firestore,
        'userUID', this.authService.userData.UID!,
        'countdowns', countdown.id.toString()
      );
      deleteDoc(docRef)
        .then(console.log)
        .catch(err => console.error(err))
    }
    this._countdowns.splice(
      this._countdowns.indexOf(countdown),
      1
    )
  }

  editCountdown(oldCountdown: Countdown, newCountdown: Countdown) {
    if (this.authService.userData.active) {
      const docRef = doc(
        this.firestore,
        'userUID', this.authService.userData.UID!,
        'countdowns', oldCountdown.id.toString()
      )
      updateDoc(docRef, { ...newCountdown })
        .then(console.log)
        .catch(err => console.error(err))
    }

    this.countdowns.splice(
      this.countdowns.indexOf(oldCountdown),
      1,
      newCountdown
    )
  }
}
