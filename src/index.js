import React from 'react';
import ReactDOM from 'react-dom';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {PolygonLayer} from '@deck.gl/layers';


var rawPodaci = JSON.stringify(require('./spratovi.json'));

//var geoJSON = JSON.parse(rawPodaci);
var geoJSON = [
      {
         // Simple polygon (array of coords)
        contour: [[-122.4, 37.7], [-122.4, 37.8], [-122.5, 37.8], [-122.5, 37.7], [-122.4, 37.7]],
         zipcode: 94107,
         population: 26599,
         area: 6.11
       },
       {
         // Complex polygon with holes (array of rings)
         contour: [
           [[-122.4, 37.7], [-122.4, 37.8], [-122.5, 37.8], [-122.5, 37.7], [-122.4, 37.7]],
           [[-122.45, 37.73], [-122.47, 37.76], [-122.47, 37.71], [-122.45, 37.73]]
         ],
     zipcode: 94107,
         population: 26599,
         area: 6.11
       },
      
     ];
console.log(geoJSON);

function App(){

    //var rawPodaci = fs.readFileSync("spratovi4.geojson", "utf8");
      
    const layer = new PolygonLayer({
        id: 'polygon-layer',
        geoJSON,
        pickable: true,
        stroked: true,
        filled: true,
        wireframe: true,
        lineWidthMinPixels: 1,
        getPolygon: d => d.contour,
        getElevation: d => d.population / d.area / 10,
        getFillColor: d => [d.population / d.area / 60, 140, 0],
        getLineColor: [80, 80, 80],
        getLineWidth: 1
      });
    
      
     

    return (
        <React.Fragment>
            <DeckGL
                initialViewState={{
                longitude: 17.1974,
                latitude: 44.7778,
                zoom: 15.5,
                bearing: 0,
                pitch: 60,
                }}
                layers={[layer]}
                height="100%"
                width="100%"
                controller={true} 
            >
            <StaticMap
                mapStyle="mapbox://styles/mapbox/dark-v10"
                mapboxApiAccessToken="pk.eyJ1IjoiZHZ1a292aWMiLCJhIjoiY2toaHBpczUxMHhpYjJ5bndlNG05dWV2cCJ9.dNwJsrJM0OsLj46OGKSJIQ"
            />
            </DeckGL>
        </React.Fragment>
    )

}



    
ReactDOM.render(<App />, document.getElementById('app'));