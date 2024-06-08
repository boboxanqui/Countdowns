import { Injectable } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "@angular/fire/auth";
import { UserData } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  private _userData: UserData = {
    active: false
  }

  get userData(): UserData{
    return this._userData
  }

  setUserData( resp: UserCredential ){
    this._userData = {
      active: true,
      displayName: resp.user.displayName,
      email: resp.user.email,
      UID: resp.user.uid
    }
  }

  removeUserData(){
    this._userData = {
      active: false,
      displayName: null,
      email: null,
      UID: ''
    }
  }

  registerUser(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
  }

  loginUser(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  loginWithGoogle(): Promise<UserCredential>{
    return signInWithPopup( this.auth, new GoogleAuthProvider() )
  }

  loginWithGithub(): Promise<UserCredential>{
    return signInWithPopup(this.auth, new GithubAuthProvider() )
  }

  logoutUser(): Promise<void> {
    return signOut(this.auth);
  }
}
