import React, {useState} from 'react';
import DeckGL, {GeoJsonLayer} from 'deck.gl';
import {StaticMap, Marker, Popup} from 'react-map-gl';
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

const editPopup = ({pickedBuilding, closePopup}) => {
  return (
    <Popup
      latitude={JSON.parse(pickedBuilding).properties.height}
     // longitude={marker.longitude}
      onClose={closePopup}
      closeButton={true}
      closeOnClick={false}
      offsetTop={-30}
     >
      <p>{JSON.parse(pickedBuilding).properties.height}</p>
    </Popup>
  )};

  // const renderPopup = () => {
  //   if (pickedBuilding !== null && pickedBuilding !== undefined) {
  //     return (
  //       <Popup
  //         captureClick
  //         closeButton={false}
  //         closeOnClick
  //         longitude={selectedPoint.geometry.coordinates[0]}
  //         latitude={selectedPoint.geometry.coordinates[1]}
  //         onClose={deselectPoint}
  //         className={styles.popup}
  //         offsetTop={-10}
  //       >
  //         <div>{selectedPoint?.properties?.name}</div>
  //       </Popup>
  //     );
  //   }
  // };

  const renderPopup = () => {
    if (pickedBuilding !== null && pickedBuilding !== undefined){
      return(
        <Popup
          anchor="bottom"
          tipSize={10}
          longitude={pickedBuilding.properties.coordinates[0][0]}
          latitude={pickedBuilding.properties.coordinates[0][1]}
          closeButton={true}
          closeOnClick={true}
          >
            <div style="height:100px; width: 100px">
              <p> lon = {pickedBuilding.properties.coordinates[0][0]} </p>
              <p> lat = {pickedBuilding.properties.coordinates[0][1]} </p>
            </div>
        </Popup>
      
      );
  }
  }

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
    map.addLayer(new MapboxLayer({id: 'buildings', deck}), 'waterway-label');
    //map.getLayer("")
  }
  
  
  render() {
    const {gl} = this.state;
    const layer = new GeoJsonLayer({
      id: 'buildings',
      data: 'https://raw.githubusercontent.com/dvukovic13/HoloscopeReactApp/main/spratovi2.geojson',
      opacity: 0.4,
      /* props from PolygonLayer class */
      
      // elevationScale: 1,
      extruded: true,
      filled: true,
     // dataTransform: d => d.features,
      getElevation: d => d.properties.height,
      getFillColor: d => [50, 191, 219],
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
      
       autoHighlight: true,
      // coordinateOrigin: [0, 0, 0],
      // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
       highlightColor: [255,255, 255, 128],
      // modelMatrix: null,
      // opacity: 1,
      pickable: true,
      onHover: (event) => { console.log("hover"); 
        return true;},
      onClick: (event) => { pickedBuilding=event.object; console.log(JSON.stringify(pickedBuilding)); return true; }
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
        onClick={() => { console.log("DeckGL"); //renderPopup(); 
       }}
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
            >
            {renderPopup()}
            </StaticMap>
        )}
      </DeckGL>
    );
  }
}
document.getElementById('app').style.width="1000px";
    
ReactDOM.render(<App />, document.getElementById('app'));