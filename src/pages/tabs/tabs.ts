import { Component } from '@angular/core';
import { ContactPage } from '../contact/contact';
import { ViewlocatePage } from './../viewlocate/viewlocate';
import { HospitalPage } from '../hospital/hospital';
import { SprayPage } from './../spray/spray';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  public sprayIcon: any;

  // tab1Root = HomePage;
  tab1Root = ViewlocatePage
  tab2Root = HospitalPage;
  tab3Root = SprayPage;
  tab4Root = ContactPage;

  constructor() {
  }
}
