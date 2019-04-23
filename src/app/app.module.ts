import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ViewlocatePageModule } from './../pages/viewlocate/viewlocate.module';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServiceProvider } from '../providers/service/service';
import { HttpClientModule } from '@angular/common/http';
import { SprayPageModule } from '../pages/spray/spray.module';
import { HospitalPageModule } from '../pages/hospital/hospital.module';
import { FormsModule } from '@angular/forms';
import { MarkerProvider } from '../providers/marker/marker';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    FormsModule,
    BrowserModule,
    ViewlocatePageModule,
    SprayPageModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HospitalPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Geolocation,
    ServiceProvider,
    MarkerProvider
  ]
})
export class AppModule { }
