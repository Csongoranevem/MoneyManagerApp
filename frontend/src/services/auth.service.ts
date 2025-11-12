import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { enviroment } from '../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private tokenName= enviroment.tokenName
  private Isloggedin = new BehaviorSubject<boolean >(this.HasToken());
  Isloggedin$ = this.Isloggedin.asObservable();

  HasToken():boolean{
    const session = sessionStorage.getItem(this.tokenName);
    if(session) return true;
    const local = localStorage.getItem(this.tokenName)
    if(local){
      sessionStorage.setItem(this.tokenName,local)
      return true;
    }
    return false;

  }

  storeUser(token:string){
    localStorage.setItem(this.tokenName, token)
  }

  getToken():number{
    return sessionStorage.getItem(this.tokenName.toString()) ? JSON.parse(sessionStorage.getItem(this.tokenName)!).ID : 0
  }

  login(token:string){
    sessionStorage.setItem(this.tokenName,token)
    this.Isloggedin.next(true)
  }
  logout(){
    sessionStorage.removeItem(this.tokenName)
    localStorage.removeItem(this.tokenName)
    this.Isloggedin.next(false)
  }
  loggedUser(){
    const token = sessionStorage.getItem(this.tokenName)
    if(token){
      return JSON.parse(token)
    }
    return null
  }
  isAdmin():boolean{
    const user = this.loggedUser();
    if (user) return user[0].role ==='admin';
    return false
  }
  isLoggedUser():boolean{
    return this.Isloggedin.value
  }
}
