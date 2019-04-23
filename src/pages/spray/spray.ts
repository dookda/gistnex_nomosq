import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as L from 'leaflet';
import { ServiceProvider } from '../../providers/service/service';

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
  public validInput = true;

  public description: any;
  public reporter: any;

  public data: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SprayPage');
    this.loadMap();
  }

  loadMap() {
    this.map2 = L.map('map2', { zoomControl: false }).setView([16.7421394, 100.19199189999999], 13);

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
    this.getCircle();

    // add circle
    this.map2.on('click', (e: any) => {
      this.map2.eachLayer((lyr: any) => {
        if (lyr.options.fsName == 'mk' || lyr.options.fsName == 'cc') {
          this.map2.removeLayer(lyr);
        }
      });
      let latlon = [e.latlng.lat, e.latlng.lng]
      let marker = L.marker(latlon, {
        fsName: 'mk'
      });
      marker.addTo(this.map2);
      let circle = L.circle(latlon, {
        radius: 500,
        fsName: 'cc'
      });
      circle.addTo(this.map2);
      let geom = (JSON.stringify(circle.toGeoJSON().geometry));
      this.data = {
        geom: geom
      }
      this.validInput = false;
    })
    this.getLocation();
  }

  getLocation() {
    this.service.getLocation().then((res: any) => {
      let latlon = [res.coords.latitude, res.coords.longitude];

      let marker = L.marker(latlon);

      marker.addTo(this.map2);

      this.map2.setView(latlon, 13);
    })
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
      this.service.addCircle(this.data).then((res: any) => {
        this.getCircle();
      })
    }
  }

}
