import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Map, map, LatLngTuple, tileLayer } from 'leaflet';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private readonly DEFAULT_LATLNG: LatLngTuple = [21.1357616, 72.7688223]
  @ViewChild('map', { static: true }) mapRef!: ElementRef;
  map!: Map;
  constructor() { }

  ngOnInit(): void {
    this.initializeMap();
  }

  initializeMap() {
    if (this.map) return;

    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false
    }).setView(this.DEFAULT_LATLNG, 1);

    tileLayer('https://{s}.title.osm.org/{z}/{x}/{y}.png').addTo(this.map);
  }

}
