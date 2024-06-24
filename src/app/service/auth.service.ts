import { Injectable } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, onAuthStateChanged, User } from "@angular/fire/auth";
import { UserData } from '../interfaces';
import { Observable, Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {
    this._userData.active ?
      this._activeUser.next(true) :
      this._activeUser.next(false)
  }

  private _activeUser = new Subject<boolean>();

  private _userData: UserData = {
    active: false
  }

  get activeUser$(): Observable<boolean> {
    return this._activeUser
  }

  get userData(): UserData {
    return this._userData
  }

  setUserData(user: User) {
    this._userData = {
      active: true,
      displayName: user.displayName,
      email: user.email,
      UID: user.uid
    }
    this._activeUser.next(true)
  }

  removeUserData() {
    this._userData = {
      active: false,
      displayName: null,
      email: null,
      UID: ''
    }
    this._activeUser.next(false)
  }

  registerUser(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  loginUser(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  loginWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(this.auth, new GoogleAuthProvider())
  }

  loginWithGithub(): Promise<UserCredential> {
    return signInWithPopup(this.auth, new GithubAuthProvider())
  }

  logoutUser(): Promise<void> {
    return signOut(this.auth);
  }

  currentUser(): User | null {
    return this.auth.currentUser
  }

}
