import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { AppSettings } from '../app-settings';
import { User } from '../data-model/user.model';
import { UsersService } from '../service/users.service';
import { ExpenseDataService } from '../service/expense-data.service';
import { Plugins, DeviceInfo } from '@capacitor/core';


const { Device } = Plugins;

@Injectable()
export class AuthService {

  

  private loggedIn = new BehaviorSubject<boolean>(this.tokenAvailable());

  
  constructor(private router: Router,
    private http: HttpClient, 
    private usersService: UsersService,
    private expenseDataService: ExpenseDataService) {


  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }




  private tokenAvailable(): boolean {
    var currentUser = JSON.parse(localStorage.getItem(AppSettings.LOCAL_STORAGE_CURRENT_USER));
    if (currentUser && currentUser.token) { //&& (currentUser.user.userType.name === AppSettings.USER_TYPE_USER_TEXT)
      return true;
    }
    return false;
  }


  setLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }



  login(loginDetails: any): Observable<User> {



    return  new Observable((observer) => {
      //this.http.get<User[]>("./assets/users.json")
      this.usersService.userData
        .subscribe(response => {
          if (response.find(u => u.username === loginDetails.username && u.password === loginDetails.password)) {

            observer.next(response.find(u => u.username === loginDetails.username && u.password === loginDetails.password));
            observer.complete();
          }else{
            observer.next(null);
            observer.complete();
          }
        }

        )
    });
    
  }

  logOut() {


    this.clearUserSpecificItems();

    this.setLoggedIn(false);

    this.router.navigate(['app-login']);
  }

  clearUserSpecificItems() {
    localStorage.removeItem(AppSettings.LOCAL_STORAGE_CURRENT_USER);
    this.expenseDataService.pushExpenses([]);
  }

  getDeviceInfo() :Promise<DeviceInfo> {

    // console.log('this.platform.ANDROID: ',this.platform.ANDROID);

    return Device.getInfo();
  }


}
