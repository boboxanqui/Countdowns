import { Injectable } from '@angular/core';
import { Countdown, CountdownFirestore } from '../interfaces';
import { Firestore, collection, collectionData, setDoc, getDocs, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { DocumentData, DocumentSnapshot } from 'rxfire/firestore/interfaces';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const RECURRENCE_UNIT: { [key: string]: dayjs.ManipulateType } = {
  weekly: 'week',
  monthly: 'month',
  yearly: 'year'
}

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

  // Computes timeLeft synchronously so a countdown never renders blank while
  // waiting for AppComponent's 1-second tick() to catch up.
  private syncTimeLeft(countdown: Countdown): void {
    countdown.timeLeft = Math.max(countdown.date.getTime() - Date.now(), 0)
  }

  setCountdowns(newCountdowns: Countdown[]) {
    if (this.countdowns.length === 0) {
      newCountdowns.forEach(countdown => this.syncTimeLeft(countdown))
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
      if ( JSON.stringify(newCountdown) != JSON.stringify(oldCountdown) ) {
        this.syncTimeLeft(newCountdown)
        this._countdowns.splice(
          this.countdowns.findIndex(oldCountdown => newCountdown.id === oldCountdown.id),
          1,
          newCountdown)
      }
    })
    // Drop local countdowns no longer present in the latest snapshot
    // (e.g. on logout, when newCountdowns is empty).
    const newIds = newCountdowns.map(countdown => countdown.id)
    this._countdowns = this._countdowns.filter(countdown => newIds.includes(countdown.id))
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

  // Firestore rejects fields with an `undefined` value (it throws synchronously,
  // before any promise is created), so optional Countdown fields must be
  // stripped out rather than sent as `undefined`.
  // Local-only id for anonymous users (no Firestore doc to derive an id from).
  private generateLocalId(): string {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
  }

  private withoutUndefinedFields(countdown: Countdown): Partial<Countdown> {
    return Object.fromEntries(
      Object.entries(countdown).filter(([, value]) => value !== undefined)
    ) as Partial<Countdown>
  }

  addCountdown(newCountdown: Omit<Countdown, 'id'>) {
    let countdown: Countdown
    if (this.authService.userData.active) {
      const collectionRef = collection(
        this.firestore,
        'userUID', this.authService.userData.UID!,
        'countdowns'
      );
      const docRef = doc(collectionRef)
      countdown = { ...newCountdown, id: docRef.id }
      setDoc(docRef, this.withoutUndefinedFields(countdown))
        .then(console.log)
        .catch(err => console.error(err))
    } else {
      countdown = { ...newCountdown, id: this.generateLocalId() }
    }
    this.syncTimeLeft(countdown)
    this._countdowns.push(countdown)
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

  // Recalculates the next occurrence of an expired recurring countdown,
  // preserving the original local hour/minute and letting the target
  // timezone's DST offset be re-resolved for the new calendar date.
  getNextRecurrenceDate(expiredDate: Date, tz: string, recurrence: string): Date {
    const unit = RECURRENCE_UNIT[recurrence]
    const localExpired = dayjs(expiredDate).tz(tz)
    const nextLocal = localExpired.add(1, unit)
    const wallClock = nextLocal.format('YYYY-MM-DD HH:mm:ss')
    return dayjs.tz(wallClock, tz).toDate()
  }

  editCountdown(oldCountdown: Countdown, newCountdown: Countdown) {
    if (this.authService.userData.active) {
      const docRef = doc(
        this.firestore,
        'userUID', this.authService.userData.UID!,
        'countdowns', oldCountdown.id.toString()
      )
      updateDoc( docRef, this.withoutUndefinedFields(newCountdown) )
        .catch( err => console.error(err))
    }

    this.syncTimeLeft(newCountdown)
    this.countdowns.splice(
      this.countdowns.indexOf(oldCountdown),
      1,
      newCountdown
    )
  }
}
