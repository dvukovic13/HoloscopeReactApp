import React from 'react';
import DeckGL, {GeoJsonLayer} from 'deck.gl';
import {StaticMap} from 'react-map-gl';
import ReactDOM from 'react-dom'
import {MapboxLayer} from '@deck.gl/mapbox';



const INITIAL_VIEW_STATE = {
  longitude: 17.1974,
	  latitude: 44.7778,
	  zoom: 15.5,
	  bearing: 0,
	  pitch: 60,
}

var pickedBuilding = null;

export class App extends React.Component {
  state = {};

  // DeckGL and mapbox will both draw into this WebGL context
  _onWebGLInitialized = (gl) => {
    this.setState({gl});
  }

  // Add deck layer to mapbox
  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;
    map.addLayer(new MapboxLayer({id: 'PolygonLayer', deck}), 'waterway-label');
    //map.getLayer("")
  }
  
  render() {
    const {gl} = this.state;
    const layer = new GeoJsonLayer({
      id: 'PolygonLayer',
      data: 'https://raw.githubusercontent.com/dvukovic13/HoloscopeReactApp/main/spratovi2.geojson',
      opacity: 1,
      /* props from PolygonLayer class */
      
      // elevationScale: 1,
      extruded: true,
      filled: true,
     // dataTransform: d => d.features,
      getElevation: d => d.properties.height,
      getFillColor: d => [60, 140, 0],
      getLineColor: [80, 80, 80],
      //getLineWidth: d => 1,
      //getPolygon: d => d.geometry.coordinates,
      // lineJointRounded: false,
      // lineMiterLimit: 4,
      // lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
      lineWidthMinPixels: 1,
      // lineWidthScale: 1,
      // lineWidthUnits: 'meters',
      // material: true,
      stroked: false,
      wireframe: true,
      
      /* props inherited from Layer class */
      
      // autoHighlight: false,
      // coordinateOrigin: [0, 0, 0],
      // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      // highlightColor: [0, 0, 128, 128],
      // modelMatrix: null,
      // opacity: 1,
      pickable: true,
      onClick: (event) => { pickedBuilding=JSON.stringify(event.object); console.log(pickedBuilding); return true; }
      // visible: true,
      // wrapLongitude: false,
    });
    

    return (
      <DeckGL
        ref={ref => {
          // save a reference to the Deck instance
          this._deck = ref && ref.deck;
        }}
        layers={layer}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        onClick={() => { console.log("DeckGL");  }}
        onWebGLInitialized={this._onWebGLInitialized}
      >
        {gl && (
          <StaticMap
            ref={ref => {
              // save a reference to the mapboxgl.Map instance
              this._map = ref && ref.getMap();
            }}
            gl={gl}
            mapStyle="mapbox://styles/mapbox/dark-v10"
            mapboxApiAccessToken="pk.eyJ1IjoiZHZ1a292aWMiLCJhIjoiY2toaHBpczUxMHhpYjJ5bndlNG05dWV2cCJ9.dNwJsrJM0OsLj46OGKSJIQ"
            onLoad={this._onMapLoad}
          />
        )}
      </DeckGL>
    );
  }
}

    
ReactDOM.render(<App />, document.getElementById('app'));