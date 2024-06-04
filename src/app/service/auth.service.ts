import { Injectable } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

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
