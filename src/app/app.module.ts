import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ViewlocatePageModule } from './../pages/viewlocate/viewlocate.module';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ContactPage } from '../pages/contact/contact';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServiceProvider } from '../providers/service/service';
import { HttpClientModule } from '@angular/common/http';
import { SprayPageModule } from '../pages/spray/spray.module';
import { HospitalPageModule } from '../pages/hospital/hospital.module';
import { FormsModule } from '@angular/forms';
import { MarkerProvider } from '../providers/marker/marker';
import { DetailPage } from '../pages/detail/detail';
import { RoutingPage } from '../pages/routing/routing';



@NgModule({
  declarations: [
    MyApp,
    ContactPage,
    TabsPage,
    DetailPage,
    RoutingPage
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
    ContactPage,
    TabsPage,
    DetailPage,
    RoutingPage
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
