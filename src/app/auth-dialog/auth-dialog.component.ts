import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styles: [
  ]
})
export class AuthDialogComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

  }

  emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+?[a-z0-9](?:[a-z0-9-]*[a-z0-9])+?/g;
  passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/gm // 6 char, 1 mayus, 1 minus, 1 num
  showRegisterForm: boolean = true; // FIXME: change to false
  submittedLogin: boolean = false;
  submittedRegister: boolean = false;
  seePassword: boolean = false;

  formLogin: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })

  formRegister: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(this.passwordRegex)
    ]]
  })

  getValueLogin(input: string) {
    return this.formLogin.get(input)?.value
  }

  getValueRegister(input: string) {
    return this.formRegister.get(input)?.value
  }

  invalidLogin(input: string) {
    return this.formLogin.controls[input].invalid && !this.showRegisterForm
  }

  invalidRegister(input: string) {
    return this.formRegister.controls[input].invalid && this.showRegisterForm
  }

  errorsRegister(input: string) {
    return this.formRegister.controls[input].errors
  }

  isPasswordRegisterInputLengthEnough() {
    const lengthEnough = 6;
    return this.getValueRegister('password').length >= lengthEnough
  }

  hasPasswordRegisterInputUpperCase() {
    const upperCase = /[A-Z]/g
    return upperCase.test(this.getValueRegister('password'))
  }

  hasPasswordRegisterInputLowerCase() {
    const lowerCase = /[a-z]/g
    return lowerCase.test(this.getValueRegister('password'))
  }

  hasPasswordRegisterInputNumber() {
    const anyNummber = /[0-9]/g
    return anyNummber.test(this.getValueRegister('password'))
  }

  visblePassword() {
    return this.seePassword ? 'text' : 'password'
  }

  inputFocus() {
    return this.formRegister.get('password')?.pristine
  }

  submitLogin() {
    this.submittedLogin = true;
    if (this.formLogin.invalid) return

    this.authService.loginUser(
      this.getValueLogin('email'),
      this.getValueLogin('password')
    ).then(console.log)
      .catch(err => console.error(err))
  }

  submitRegister() {
    this.submittedRegister = true;
    if (this.formRegister.invalid) return

    this.authService.registerUser(
      this.getValueRegister('email'),
      this.getValueRegister('password')
    ).then(console.log)
      .catch(err => console.error(err))
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then(console.log)
      .catch(err => console.error(err))
  }

  loginWithGithub() {
    this.authService.loginWithGithub()
      .then(console.log)
      .catch(err => console.error(err))
  }
}
