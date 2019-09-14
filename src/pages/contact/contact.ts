import { MarkerProvider } from './../../providers/marker/marker';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  public faq1: any;
  public faq2: any;
  public faq3: any;
  public faq4: any;
  public faq5: any;

  constructor(
    public navCtrl: NavController,
    public markerProvider: MarkerProvider
  ) {

  }

  gotoWeb() {
    window.open("http://google.com", '_system', 'location=yes');
  }

}
