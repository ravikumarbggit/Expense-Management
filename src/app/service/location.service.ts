import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocationModel } from "../data-model/location.model";


@Injectable({
    providedIn: 'root'
  })
  export class LocationService {

    ipInfoUrl: string = "https://ipinfo.io";
    constructor(private http: HttpClient) {
  
    }

    getCountry(): Observable<LocationModel>{
        return this.http.get<LocationModel>(this.ipInfoUrl);
    }
    


  }