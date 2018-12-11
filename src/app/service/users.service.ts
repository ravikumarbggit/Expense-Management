import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../data-model/user.model";
import { HttpClient } from '@angular/common/http';
import { AppSettings } from "../app-settings";

@Injectable({
    providedIn: 'root'
  })
  export class UsersService {
  
    private userObjects = new BehaviorSubject<User[]>(null);
  
    userData = this.userObjects.asObservable();
  
    constructor(private http: HttpClient) {
  
    }
    
    getCurrentUser(): User {

      let localUser = JSON.parse(localStorage.getItem(AppSettings.LOCAL_STORAGE_CURRENT_USER));

      if(localUser){
        return localUser.user;
      }
      else{
        return null;
      }
      // return JSON.parse(localStorage.getItem(AppSettings.LOCAL_STORAGE_CURRENT_USER)).user;
    }
  
    pushUsers(inData: User[])  {
      console.log("inside push data", inData)
      this.userObjects.next(inData)    
    }
  
    public getJSON(): Observable<User[]> {
      return this.http.get<User[]>("./assets/users.json")
    }
  
  }
  