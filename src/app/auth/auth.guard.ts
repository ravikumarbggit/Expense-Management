
import {map, take, flatMap, tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';



import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router,
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
        take(1),
        map((isLoggedIn: boolean) => {
          console.log('in canActivate', isLoggedIn, next);
          if(!isLoggedIn){

            this.router.navigate(['/app-login']);
            return false;

          }

          // 

          return true;
        }),);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isLoggedIn().pipe(
        take(1),
        map((isLoggedIn: boolean) => {
          console.log('in canActivateChild', isLoggedIn, next.routeConfig.path);
          if(!isLoggedIn){
           
            this.router.navigate(['/app-login']);
            return false;
                
          }else{

            
              return true;
            
          }
          
        }),);



  }
}
