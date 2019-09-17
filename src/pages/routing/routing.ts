import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-routing',
  templateUrl: 'routing.html',
})
export class RoutingPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  start: any;
  end: any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    const latlon = this.navParams.get('latlon');
    this.start = latlon.start;
    this.end = latlon.end;
    // console.log(latlon);
  }

  ionViewDidLoad() {
    this.initMap();
    this.getRoute();
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 7,
      center: { lat: 41.85, lng: -87.65 }
    });
    this.directionsDisplay.setMap(this.map);
  }

  getRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING'
    }, (res: any, status: any) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(res);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}
