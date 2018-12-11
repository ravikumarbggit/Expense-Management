import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
//import { ExpenseDataService } from '../expense-data.service';
import { SidenavService } from '../service/sidenav.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit {

  @ViewChild('sidenavIndex') public sideNav:MatSidenav;

  constructor(
      private sideNavService: SidenavService
    , private router: Router){

  }

  ngOnInit(){
    this.sideNavService.setSidenav(this.sideNav);

    this.router.events
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.sideNavService.close().then(() => { });
        }
      });
  }

}
