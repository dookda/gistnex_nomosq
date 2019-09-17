import { MarkerProvider } from './../../providers/marker/marker';
import { ServiceProvider } from './../../providers/service/service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as L from 'leaflet';
import { RoutingPage } from '../routing/routing';

@IonicPage()
@Component({
  selector: 'page-hospital',
  templateUrl: 'hospital.html',
})
export class HospitalPage {
  public map3: any;
  public marker: any;
  public latlon: any;
  public lyrGroup: any;
  public r: any;

  public redHospital: any;

  public radius = 10000;

  public hospitalLst: any;
  public hospitalSum: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public markerService: MarkerProvider
  ) {
  }

  async ionViewDidLoad() {
    await this.loadMap();
    await this.getLocation();
  }

  async loadMap() {
    this.map3 = L.map('map3', { zoomControl: false }).setView([16.7421394, 100.19199189999999], 13);

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

    this.lyrGroup = L.layerGroup().addTo(this.map3);

    L.control.layers({
      "Google Map": googlemap.addTo(this.map3),
      "OSM": osm,
      "Thaichote": theos_wmts,
      "Google Hybrid": satellite
    }, {
      'ขอบเขตจังหวัด': pro.addTo(this.map3),
      'ขอบเขตอำเภอ': amp.addTo(this.map3),
      'ขอบเขตตำบล': tam.addTo(this.map3),
    });
    // .addTo(this.map3) 
  }

  getLocation() {
    // this.service.calLocation().subscribe((res: any) => {
    let res = this.service.getLocation();
    // console.log(res);
    this.map3.eachLayer((lyr: any) => {
      if (lyr.options.iconName == 'current' || lyr.options.iconName == 'hospital') {
        this.map3.removeLayer(lyr);
      }
    });

    const greenIcon = this.markerService.greenIcon;
    const icon = L.icon({
      iconUrl: greenIcon,
      iconSize: [32, 37],
      iconAnchor: [12, 37],
      popupAnchor: [5, -30]
    });

    this.latlon = [res.coords.latitude, res.coords.longitude];
    this.marker = L.marker(this.latlon, {
      icon: icon,
      iconName: 'current'
    }).addTo(this.map3);

    this.map3.setView(this.latlon, 13);

    this.getHospital(this.latlon[0], this.latlon[1], this.radius)
    // })
  }

  async getHospital(lat: any, lon: any, buff: any) {
    this.service.getHospital(lat, lon, buff).then((res: any) => {

      this.hospitalLst = res.features;
      this.hospitalSum = this.hospitalLst.length;

      const iconredHospital = L.icon({
        iconUrl: this.markerService.redHospital,
        iconSize: [25, 25],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
      });

      const iconpinkHospital = L.icon({
        iconUrl: this.markerService.pinkHospital,
        iconSize: [25, 25],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
      });

      const icongreenHospital = L.icon({
        iconUrl: this.markerService.greenHospital,
        iconSize: [25, 25],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
      });

      const iconorangeHospital = L.icon({
        iconUrl: this.markerService.orangeHospital,
        iconSize: [25, 25],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
      });

      const iconblueHospital = L.icon({
        iconUrl: this.markerService.blueHospital,
        iconSize: [25, 25],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
      });

      let icon;
      let marker = L.geoJSON(res, {
        pointToLayer: function (feature, latlon) {
          if (feature.properties.typecode == 5 || feature.properties.typecode == 4 || feature.properties.typecode == 7 || feature.properties.typecode == 62) {
            icon = iconredHospital;
          } else if (feature.properties.typecode == 3) {
            icon = iconpinkHospital;
          } else if (feature.properties.typecode == 8) {
            icon = icongreenHospital;
          } else if (feature.properties.typecode == 9) {
            icon = iconorangeHospital;
          } else if (feature.properties.typecode == 2 || feature.properties.typecode == 1) {
            icon = iconblueHospital;
          }

          return L.marker(latlon, {
            icon: icon,
            iconName: 'hospital'
          });
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties) {
            layer.bindPopup(
              feature.properties.name + '</br>'
            );
          }
        }
      });
      this.lyrGroup.addLayer(marker);
    })
  }

  selectDistance(e: any) {
    // console.log(this.radius);
    this.getLocation();
  }

  gotoRoute(e: any) {
    // console.log(e.properties.lat, e.properties.lon);
    const latlon = {
      start: {
        lat: this.latlon[0],
        lng: this.latlon[1]
      },
      end: {
        lat: e.properties.lat,
        lng: e.properties.lon
      }
    }
    this.navCtrl.push(RoutingPage, { latlon: latlon });
  }

}
