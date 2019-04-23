import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable()
export class ServiceProvider {
  public location: any;

  constructor(
    public http: HttpClient,
    public geolocation: Geolocation
  ) {
    console.log('Hello ServiceProvider Provider');
  }

  getDengue(lat: any, lon: any, buff: any) {
    return new Promise((res, rej) => {
      const url = `http://cgi.uru.ac.th:3000/api/dengue/${lat}/${lon}/${buff}`;
      this.http.get(url).subscribe(data => {
        res(data);
      }, (err) => {
        rej(err);
      })
    });
  }

  getHospital(lat: any, lon: any, buff: any) {
    return new Promise((res, rej) => {
      const url = `http://cgi.uru.ac.th:3000/api/hospital/${lat}/${lon}/${buff}`;
      this.http.get(url).subscribe(data => {
        res(data);
      }, (err) => {
        rej(err);
      })
    });
  }

  setLocation(location: any) {
    this.location = location;
  }

  getLocation() {
    return new Promise((res, rej) => {
      res(this.location);
    })
  }

  addCircle(obj: any) {
    return new Promise((res, rej) => {
      const url = `http://cgi.uru.ac.th:3000/api/addcircle`;
      this.http.post(url, obj).subscribe((data: any) => {
        res(data);
      }, (err) => {
        rej(err);
      })
    })
  }

  getCircle() {
    return new Promise((res, rej) => {
      const url = `http://cgi.uru.ac.th:3000/api/getcircle`;
      this.http.get(url).subscribe(data => {
        res(data);
      }, (err) => {
        rej(err);
      })
    });
  }

}
