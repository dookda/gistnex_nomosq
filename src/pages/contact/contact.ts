import { MarkerProvider } from './../../providers/marker/marker';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { DetailPage } from '../detail/detail';

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

  public faqs: any;

  constructor(
    public navCtrl: NavController,
    public markerProvider: MarkerProvider,
    public service: ServiceProvider
  ) {

  }

  ionViewDidLoad() {
    this.getFAQs();
  }

  gotoWeb() {
    window.open("http://google.com", '_system', 'location=yes');
  }

  getFAQs() {
    this.service.getFAQs().subscribe(res => {
      // console.log(res)
      this.faqs = res;
    })
  }

  gotoDetail(id: any) {
    // console.log(id)
    this.navCtrl.push(DetailPage, { id: id });
  }


}
