import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  isWeb: boolean = true;
  dummyMobile: string = "787087070";

  constructor(private _location: Location
    ,private authService: AuthService) { }

  ngOnInit() {

    this.authService.getDeviceInfo()
    .then(deviceInfo => {
      console.log('deviceInfo: ',deviceInfo)
      if(deviceInfo.platform === 'web'){
        this.isWeb = true;
      }
      else{
        this.isWeb = false;
      }
    });
  }

  goBack(){
    this._location.back();
  }

  crashMe(){
    throw "Crashed";
  }
}
