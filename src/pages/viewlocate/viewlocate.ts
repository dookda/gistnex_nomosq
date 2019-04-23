import { MarkerProvider } from './../../providers/marker/marker';
import { ServiceProvider } from './../../providers/service/service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as L from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@IonicPage()
@Component({
  selector: 'page-viewlocate',
  templateUrl: 'viewlocate.html',
})
export class ViewlocatePage {
  public map: any;
  public marker: any;
  public dpoint: any;
  public locateLyr: any;
  public dengueLyr: any;
  public dengueLst: any;
  public dengueSum: any;

  public markerIcon: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: ServiceProvider,
    public geolocation: Geolocation,
    public markerService: MarkerProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewlocatePage');
    this.loadMap();
  }

  loadMap() {
    this.map = L.map('map', { zoomControl: false }).setView([16.7421394, 100.19199189999999], 13);

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

    // overlay layers
    const cgiUrl = 'http://www.cgi.uru.ac.th/geoserver/ows?';

    const dengue = L.tileLayer.wms(cgiUrl, {
      layers: 'dengue:vill_dengue_2015',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      // CQL_FILTER: 'pro_code=63 OR pro_code=64 OR pro_code=53 OR pro_code=67 OR pro_code=65 OR pro_code=64'
    });

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

    // L.tileLayer.wms("http://map.nu.ac.th/geoserver-hgis/wms?", {
    //   layers: 'hgis:apps2014_p',
    //   cql_filter: 'patient>5',
    //   format: 'image/png',
    //   transparent: true,
    //   zIndex: 6
    // });

    // L.tileLayer.wms("http://map.nu.ac.th/geoserver-hgis/wms?", {
    //   layers: 'hgis:apps2014',
    //   cql_filter: 'patient>5',
    //   format: 'image/png',
    //   transparent: true,
    //   zIndex: 5
    // });

    this.dengueLyr = L.layerGroup().addTo(this.map);
    this.locateLyr = L.layerGroup().addTo(this.map);

    L.control.layers({
      "Google Map": googlemap.addTo(this.map),
      "OSM": osm,
      "Thaichote": theos_wmts,
      "Google Hybrid": satellite
    }, {
        'หมู่บ้านที่เกิดไข้เลือดออก': dengue.addTo(this.map),
        'ขอบเขตจังหวัด': pro.addTo(this.map),
        'ขอบเขตอำเภอ': amp.addTo(this.map),
        'ขอบเขตตำบล': tam.addTo(this.map),
      })

    // .addTo(this.map)

    const loc = [[16.639315, 100.149436],
    [16.650731, 100.151818],
    [16.665962, 100.158677],
    [16.685371, 100.162800],
    [16.702148, 100.168985],
    [16.713334, 100.174139],
    [16.725835, 100.178264],
    [16.736364, 100.178953],
    [16.746892, 100.184109],
    [16.754789, 100.188235],
    [16.763015, 100.193048],
    [16.769641, 100.198361],
    [16.784333, 100.201937],
    [16.791566, 100.208463],
    [16.799128, 100.214302],
    [16.806032, 100.220486],
    [16.811949, 100.228731]
    ];

    let i = 0;

    // setInterval(() => {
    const res = {
      coords: {
        latitude: loc[8][0],
        longitude: loc[8][1]
      }
    }

    console.log(res)

    this.getDengue(res.coords.latitude, res.coords.longitude, 1000);
    this.getLocation(res);
    i += 1
    // }, 3000)

    // getLocation

  }


  getLocation(res: any) {
    // this.geolocation.watchPosition().subscribe((res1: any) => {
    // let latlng = [res.coords.latitude, res.coords.longitude];
    this.service.setLocation(res);
    // })
  }

  async getDengue(lat: any, lon: any, buff: any) {
    this.map.eachLayer((lyr: any) => {
      if (lyr.options.iconName == 'now' || lyr.options.iconName == 'dengue') {
        this.map.removeLayer(lyr);
      }
    });

    await this.service.getDengue(lat, lon, buff).then((res: any) => {

      // nowlocation
      this.dengueLst = res.features;
      this.dengueSum = this.dengueLst.length;
      const latlng = [lat, lon]
      console.log(latlng);
      if (this.dengueSum > 0) {
        this.markerIcon = this.markerService.redIcon;
      } else {
        this.markerIcon = this.markerService.greenIcon;
      }
      const iconNow = L.icon({
        iconUrl: this.markerIcon, //'../../assets/imgs/marker.png',
        iconSize: [32, 32],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
      });
      this.marker = L.marker(latlng, {
        icon: iconNow,
        iconName: 'now'
      }).addTo(this.map);
      this.map.setView(latlng, 14);
      this.locateLyr.addLayer(this.marker);

      // house dengue
      const houseIcon = L.icon({
        iconUrl: this.markerService.hourseIcon,
        iconSize: [32, 37],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
      });
      let marker = L.geoJSON(res, {
        pointToLayer: function (feature: any, latlon: any) {
          return L.marker(latlon, {
            icon: houseIcon,
            iconName: 'dengue'
          });
        },
        onEachFeature: (feature: any, layer: any) => {
          if (feature.properties) {
            layer.bindPopup(
              'ชื่อ: ' + feature.properties.vill_nam_t + '</br>'
            );
          }
        }
      });
      this.dengueLyr.addLayer(marker);
    })
  }

  showTable() {
    // this.
    console.log('dada')
  }
}
