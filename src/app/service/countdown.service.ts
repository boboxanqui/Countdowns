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

  setCountdowns(newCountdowns: Countdown[]) {
    if (this.countdowns.length === 0) {
      this._countdowns = [...newCountdowns]
      return
    }
    const oldCountdownsNoTimeLeft: Countdown[] = this.countdowns.map(countdown => {
      let noTimeleft = { ...countdown }
      delete noTimeleft.timeLeft;
      return noTimeleft
    }
    )
    newCountdowns.forEach(newCountdown => {
      let oldCountdown  = oldCountdownsNoTimeLeft.find( oldCountdown => newCountdown.id === oldCountdown.id );
      delete oldCountdown?.timeLeft;
      console.log( JSON.stringify(newCountdown) == JSON.stringify(oldCountdown) );
      if ( JSON.stringify(newCountdown) != JSON.stringify(oldCountdown) ) {
        console.log('Updated countdown');
        console.table(newCountdown);
        console.table(oldCountdown);
        this._countdowns.splice(
          this.countdowns.findIndex(oldCountdown => newCountdown.id === oldCountdown.id),
          1,
          newCountdown)
      }
    })
    // this._countdowns = [...newCountdowns]
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

  //NOTE: function not in usage
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
      updateDoc( docRef, {...newCountdown} )
        .catch( err => console.error(err))
    }

    this.countdowns.splice(
      this.countdowns.indexOf(oldCountdown),
      1,
      newCountdown
    )
  }
}
