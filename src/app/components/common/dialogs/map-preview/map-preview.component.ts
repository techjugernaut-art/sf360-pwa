import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-map-preview',
  templateUrl: './map-preview.component.html',
  styleUrls: ['./map-preview.component.scss']
})
export class MapPreviewComponent implements OnInit {
  origin: any;
  destination: any;
  location;
  selectedMarker;

  constructor(
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.origin = {
      lat: 5.8142835999999996,
      lng: 120.979021
    };
    this.destination = {
      lat: 5.8142835999999996,
      lng: 0.0746767
    };
    this.location = {
      latitude: 5.8142835999999996,
      longitude: 0.0746767,
      mapType: 'normal',
      zoom: 12,
      markers: [
        {
          lat: 5.8142835999999996,
          lng: 0.0746767
        }
      ]
    };
  }

  addMarker(lat: number, lng: number) {
    this.location.markers.push({
      lat,
      lng
    });
  }

  selectMarker(event) {
    this.selectedMarker = {
      lat: event.latitude,
      lng: event.longitude
    };
  }
}
