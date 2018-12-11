import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../data-model/user.model";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
  export class UsersService {
  
    private userObjects = new BehaviorSubject<User[]>(null);
  
    userData = this.userObjects.asObservable();
  
    constructor(private http: HttpClient) {
  
    }
  
  
    pushUsers(inData: User[])  {
      console.log("inside push data", inData)
      this.userObjects.next(inData)    
    }
  
    public getJSON(): Observable<User[]> {
      return this.http.get<User[]>("./assets/users.json")
    }
  
  }
  