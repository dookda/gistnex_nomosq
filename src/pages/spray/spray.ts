import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MarkerProvider } from './../../providers/marker/marker';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as L from 'leaflet';
import { ServiceProvider } from '../../providers/service/service';
import { UnsubscriptionError } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-spray',
  templateUrl: 'spray.html',
})
export class SprayPage {
  public map2: any;
  public marker: any;
  public dpoint: any;
  public circle: any;
  public validInput = 'true';

  public description: any;
  public reporter: any;

  public data: any;
  public arr = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public markerService: MarkerProvider,
    public geolocation: Geolocation,
    public platform: Platform
  ) {
    platform.ready().then(() => {

    })
  }

  async ionViewDidLoad() {
    // console.log('ionViewDidLoad SprayPage');
    this.loadMap();
    // await this.getLocation();
  }

  loadMap() {
    this.map2 = L.map('map2', { zoomControl: false }).setView([16.7421394, 100.19199189999999], 19);

    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })

    var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })

    var theos_wmts = L.tileLayer(
      'http://go-tiles1.gistda.or.th/mapproxy/wmts/thaichote/GLOBAL_WEBMERCATOR/{z}/{x}/{y}.png', {
        minZoom: 0,
        maxZoom: 20,
        format: 'image/png',
        attribution: '&copy; <a href = "http://www.gistda.or.th">GISTDA</a>',
      })

    var googlemap = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      format: 'image/png',
    });

    // overlay
    const cgiUrl = 'http://www.cgi.uru.ac.th/geoserver/ows?';

    const pro = L.tileLayer.wms(cgiUrl, {
      layers: 'th:province_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=63 OR pro_code=64 OR pro_code=53 OR pro_code=67 OR pro_code=65 OR pro_code=64'
    });

    const amp = L.tileLayer.wms(cgiUrl, {
      layers: '	th:amphoe_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=63 OR pro_code=64 OR pro_code=53 OR pro_code=67 OR pro_code=65 OR pro_code=64'
    });

    const tam = L.tileLayer.wms(cgiUrl, {
      layers: 'th:tambon_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=63 OR pro_code=64 OR pro_code=53 OR pro_code=67 OR pro_code=65 OR pro_code=64'
    });

    const baseLyr = {
      "Google Map": googlemap.addTo(this.map2),
      "OSM": osm,
      "Thaichote": theos_wmts,
      "Google Hybrid": satellite
    }

    const overLyr = {
      'ขอบเขตจังหวัด': pro.addTo(this.map2),
      'ขอบเขตอำเภอ': amp.addTo(this.map2),
      'ขอบเขตตำบล': tam.addTo(this.map2),
    }

    L.control.layers(baseLyr, overLyr);

    // add circle
    // this.getCircle();

    // add circle
    // this.map2.on('click', (e: any) => {
    //   this.map2.eachLayer((lyr: any) => {
    //     if (lyr.options.fsName == 'mk' || lyr.options.fsName == 'cc') {
    //       this.map2.removeLayer(lyr);
    //     }
    //   });
    //   let latlon = [e.latlng.lat, e.latlng.lng]
    //   let marker = L.marker(latlon, {
    //     fsName: 'mk'
    //   });
    //   marker.addTo(this.map2);
    //   let circle = L.circle(latlon, {
    //     radius: 500,
    //     fsName: 'cc'
    //   });
    //   circle.addTo(this.map2);
    //   let geom = (JSON.stringify(circle.toGeoJSON().geometry));
    //   this.data = {
    //     geom: geom
    //   }
    //   this.validInput = false;
    // })


    // get location
    // const greenIcon = this.markerService.greenIcon;
    // const icon = L.icon({
    //   iconUrl: greenIcon,
    //   iconSize: [32, 37],
    //   iconAnchor: [12, 37],
    //   popupAnchor: [5, -30]
    // });

    // this.service.calLocation().subscribe((res: any) => {
    //   console.log(res)
    //   let latlon = [res.coords.latitude, res.coords.longitude];
    //   let marker = L.marker(latlon, {
    //     icon: icon,
    //     iconName: 'current'
    //   }).addTo(this.map2);
    //   // let marker = L.marker(latlon);
    //   marker.addTo(this.map2);
    //   this.map2.setView(latlon, 13);
    // })

    const greenIcon = this.markerService.greenIcon;
    const icon = L.icon({
      iconUrl: greenIcon,
      iconSize: [32, 37],
      iconAnchor: [12, 37],
      popupAnchor: [5, -30]
    });

    let res = this.service.getLocation();
    let latlon = [res.coords.latitude, res.coords.longitude];

    let marker = L.marker(latlon, {
      icon: icon,
      iconName: 'current'
    }).addTo(this.map2);
    marker.addTo(this.map2);
    this.map2.setView(latlon, 19);
  }

  startTracking() {
    console.log('start tracking')
    this.validInput = 'false';
    this.arr = [];

    let res = this.service.getLocation();
    this.arr.push([res.coords.latitude, res.coords.longitude]);

    const greenIcon = this.markerService.greenIcon;
    const icon = L.icon({
      iconUrl: greenIcon,
      iconSize: [32, 37],
      iconAnchor: [12, 37],
      popupAnchor: [5, -30]
    });

    this.service.calLocation().subscribe((res: any) => {
      console.log(res);
      let latlon = [res.coords.latitude, res.coords.longitude];

      this.arr.push(latlon);

      let marker = L.marker(latlon, {
        icon: icon,
        iconName: 'current'
      }).addTo(this.map2);

      if (this.validInput === 'false') {
        marker.addTo(this.map2);
        this.map2.setView(latlon, 19);
      }
    });

  }

  stopTracking() {
    var latlngs = this.arr;
    var polyline = L.polyline(latlngs, { color: 'red', lineName: 'track' }).addTo(this.map2);
    let geom = (JSON.stringify(polyline.toGeoJSON().geometry));
    this.data = {
      geom: geom
    }
    console.log(this.data);
  }

  getCircle() {
    this.service.getCircle().then((res: any) => {
      this.map2.eachLayer((lyr: any) => {
        if (lyr.options.fsName == 'circle' || lyr.options.fsName == 'mk' || lyr.options.fsName == 'cc') {
          this.map2.removeLayer(lyr);
        }
      });

      let features = res.features;
      features.forEach((e: any) => {
        let latlon = [e.properties.lat, e.properties.lon];
        let cr = L.circle(latlon, {
          radius: 500,
          fsName: 'circle'
        });
        cr.addTo(this.map2);
      });
    })
  }

  addData() {
    this.data.name = this.reporter;
    this.data.desc = this.description;
    if (this.reporter !== null && this.description !== null) {
      this.service.insertFeature(this.data).then((res: any) => {
        // this.getCircle();
      })
    }

    this.map2.eachLayer((lyr: any) => {
      if (lyr.options.iconName == 'current' || lyr.options.lineName == 'track') {
        this.map2.removeLayer(lyr);
      }
    });
    this.validInput = 'true';
  }

}
