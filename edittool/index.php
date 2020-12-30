<!DOCTYPE html>
<html>
<head>
	<title>MAPA</title>
	<script src='https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.js'></script>
	<script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.2.0/mapbox-gl-draw.js'></script>
	<script src="https://unpkg.com/three@0.106.2/build/three.min.js"></script>
	<script src="https://unpkg.com/three@0.106.2/examples/js/loaders/GLTFLoader.js"></script>

	<script src="threebox.js" type="text/javascript"></script>

	
	<link href='https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css' rel='stylesheet' />
	<link rel='stylesheet' href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.2.0/mapbox-gl-draw.css' type='text/css' />

	<link rel="stylesheet" href="style.css">

</head>
<body style="background-color: #343332">

	<script src="https://api.tiles.mapbox.com/mapbox.js/plugins/turf/v3.0.11/turf.min.js"></script>

	

	<div class = "canvas-container" id="container" style="display: inline-block;">
		<div id='renderCanvas' style="width: 1920px;	height: 1080px; position: absolute;"></div>
		<button onclick="redir()" style="position:absolute; ">EDIT</button>
	</div>
	
	
	<!-- <script src="mapa.js" type="module"> </script> 
	<script type="module">import {redir} from "./mapa.js";
	window.redir = redir;
	</script>-->



<!-- <input type="text" onkeypress="ocisti()"> -->
<script type="text/javascript">

	var izabrana = null;


	function redir(){
		location.replace("./edittool.html?"+window.btoa(izabrana));

	}
	function ocisti(){
		localStorage.clear();
	}



	mapboxgl.accessToken = 'pk.eyJ1IjoiZHZ1a292aWMiLCJhIjoiY2toaHBpczUxMHhpYjJ5bndlNG05dWV2cCJ9.dNwJsrJM0OsLj46OGKSJIQ';

	const INITIAL_VIEW_STATE = {
		  latitude: 17.1974,
		  longitude: 44.7778,
		  zoom: 15.5,
		  bearing: 0,
		  pitch: 60,
		};

	

	
	var map = new mapboxgl.Map({

		container: 'renderCanvas',
		style: 'mapbox://styles/haxzie/ck0aryyna2lwq1crp7fwpm5vz',
		center: [INITIAL_VIEW_STATE.latitude,INITIAL_VIEW_STATE.longitude],
		zoom: 15.5,
		
		antialias: true

	});



	var lines = new Array();
	lines.push([]);
	console.log(lines.length);

	if (localStorage.getItem('linijeJSON') != null) {
	  
		var jj = JSON.parse(localStorage.getItem('linijeJSON'));

		for (var i = 0; i<jj.features.length; i++) {
			lines[0].push([jj.features[i].geometry.coordinates[0], jj.features[i].geometry.coordinates[1], jj.features[i].properties.height]);
		}
		//var lines = Array.from(linex);
	}


	var Draw = new MapboxDraw();

	// Map#addControl takes an optional second argument to set the position of the control.
	// If no position is specified the control defaults to `top-right`. See the docs 
	// for more details: https://docs.mapbox.com/mapbox-gl-js/api/#map#addcontrol

	map.addControl(Draw, 'top-left');


	map.on('load', function () {


		map.addSource('zgradeSource', {
			type: 'geojson',
			data: './spratovi5.geojson'
		});

		/*map.addSource('primarniVod',{
			type: 'geojson',
			data: './primarniVod.geojson'
		});*/

		//console.log(JSON.parse('./primarniVod.geojson'));

		//Draw.add(map.getSource('primarniVod').data.features);

		//console.log(map.getSource('zgrade').getClusterChildren(2));
		var layers = map.getStyle().layers;
		 
		var labelLayerId;
		for (var i = 0; i < layers.length; i++) {
			


		if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
			labelLayerId = layers[i].id;
			break;
			}
		}

	/*	map.addLayer({
			'id': 'primarniVod',
			'type': 'line',
			'source': 'primarniVod',
			'layout': {
			'line-join': 'round',
			'line-cap': 'round'
			},
			'paint': {
			'line-color': '#ffff00',
			'line-width': 2
			}
		});*/

		if (localStorage.getItem('linijeJSON') != null) {

			map.addLayer({
				id: 'custom_layer',
				type: 'custom',
				
				onAdd: function(map, mbxContext){

					tb = new Threebox(
						map, 
						mbxContext,
						{defaultLights: true}
					);
					
					if(lines[0].length>0)
						for (line of lines) {
							
							var lineOptions = {
								geometry: line,
								color: 0xffff00, 
								width: 2
							}

							lineMesh = tb.line(lineOptions);
							tb.add(lineMesh);
							for(point of line){
								sphere = tb.sphere({color: 0xffff00,  radius: 0.02})
								.setCoords([point[0], point[1],  point[2]]);
								//.setCoords([INITIAL_VIEW_STATE.latitude, INITIAL_VIEW_STATE.longitude,  50]);
								
								tb.add(sphere);
							}
							console.log(sphere);
						}

				},
				
				render: function(gl, matrix){
						tb.update();
				}
			});

		}
		
		map.setLayerZoomRange('custom_layer', 17.8, 30);


		map.addLayer(
		{
			'id': '3dzgrade',
			'source': 'zgradeSource',

			'type': 'fill-extrusion',

			'paint': {
				'fill-extrusion-color': ['get','color'],
				 

				'fill-extrusion-height':
				
				['get','height'],

				'fill-extrusion-base': 

				['get','base_height'],

				'fill-extrusion-opacity':0.3

			}

		});


		map.addSource('currentBuildings', {
			type: 'geojson',
			data: {
			  "type": "FeatureCollection",
			  "features": []
			}
		});	


		map.addLayer({

			"id": "highlight",
			"source": "currentBuildings",
			'type': 'fill-extrusion',
			'minzoom': 15,
			'paint': {
			   'fill-extrusion-color': 'white',
			 

			'fill-extrusion-height':
			
			['get','height']


			,

			'fill-extrusion-base': 
			

			['get','base_height']
			,
			'fill-extrusion-opacity': 0.5
			}
			
		}, labelLayerId);

		console.log(Draw.getAll());


		map.on('click', '3dzgrade', function(e) {
			console.log("center"+ map.getCenter());
			console.log("lat: "+map.getCenter().lat);
			console.log("lon: "+map.getCenter().lng);
			console.log(map.getZoom());

			localStorage.setItem('lat', map.getCenter().lat);
			localStorage.setItem('lon', map.getCenter().lng);
			localStorage.setItem('zoom', map.getZoom());

			map.getSource('currentBuildings').setData({
			  "type": "FeatureCollection",
			  "features": e.features
		});
			console.log(e);
			//console.log(e.features[0].properties);

		    izabrana = '{"type": "FeatureCollection",	"features": [{"type": "Feature","properties": '+JSON.stringify(e.features[0].properties)+', "geometry": '+JSON.stringify(e.features[0].geometry)+'}]}';
			  
			console.log(JSON.stringify(JSON.parse(izabrana)));

		});

		map.on('mouseenter', '3dzgrade', function () {
			map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mouseleave', '3dzgrade', function () {
			map.getCanvas().style.cursor = '';
		});

	});



	map.on('style.load', function () {

		if (localStorage.getItem('lat') === null || localStorage.getItem('lon') === null || localStorage.getItem('zoom') === null){
		
		}
		else{
			
			map.flyTo({
		// These options control the ending camera position: centered at
		// the target, at zoom level 9, and north up.
			
			center:[localStorage.getItem('lon'), localStorage.getItem('lat')],
			zoom: localStorage.getItem('zoom')+1,
			bearing: 0,
			pitch: 60,
			 
			// These options control the flight curve, making it move
			// slowly and zoom out almost completely before starting
			// to pan.
			speed: 0.5, // make the flying slow
			curve: 1, // change the speed at which it zooms out
			 
			// This can be any easing function: it takes a number between
			// 0 and 1 and returns another number between 0 and 1.
			easing: function (t) {
			return t;
			},
			 
			// this animation is considered essential with respect to prefers-reduced-motion
			essential: true
		});
			
		}

		
	});
</script>

</body>
</html>