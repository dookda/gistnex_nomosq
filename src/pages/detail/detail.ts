import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  public id: any;
  public question: any;
  public answer: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider
  ) {
    this.id = this.navParams.get('id');
    console.log(this.id);
  }

  ionViewDidLoad() {
    this.getData();
  }

  getData() {
    this.service.getFAQ(this.id).subscribe((res: Faq) => {
      this.question = res[0].question;
      this.answer = res[0].answer;
      // console.log(this.faq);
    });
  }

}

export interface Faq {
  question?: string;
  answer?: string;
}
