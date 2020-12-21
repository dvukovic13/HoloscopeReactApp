<!DOCTYPE html>
<html>
<head>
	<title>MAPA</title>
	<script src='https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.js'></script>
	<script src="https://unpkg.com/three@0.106.2/build/three.min.js"></script>
	<script src="https://unpkg.com/three@0.106.2/examples/js/loaders/GLTFLoader.js"></script>

	<script src="threebox.js" type="text/javascript"></script>

	
	<link href='https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css' rel='stylesheet' />

	<link rel="stylesheet" href="style.css">

</head>
<body style="background-color: #343332">

	<script src="https://api.tiles.mapbox.com/mapbox.js/plugins/turf/v3.0.11/turf.min.js"></script>

	

	<div id="container" style="display: inline-block;">
	<div id='map' style="width: 1800px;	height: 948px"></div>
	
	</div>
	
	
	<!-- <script src="mapa.js" type="module"> </script> 
	<script type="module">import {redir} from "./mapa.js";
	window.redir = redir;
	</script>-->

</canvas>
<button onclick="redir()" style="float: right">EDIT</button>
<input type="text" onkeypress="ocisti()">
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

		container: 'map',
		style: 'mapbox://styles/mapbox/dark-v10',
		center: [INITIAL_VIEW_STATE.latitude,INITIAL_VIEW_STATE.longitude],
		zoom: 15.5,
		container: 'map',
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


	map.on('load', function () {


		map.addSource('zgradeSource', {
			type: 'geojson',
			data: './spratovi5.geojson'
		});



			

		//console.log(map.getSource('zgrade').getClusterChildren(2));
		var layers = map.getStyle().layers;
		 
		var labelLayerId;
		for (var i = 0; i < layers.length; i++) {
			


		if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
			labelLayerId = layers[i].id;
			break;
			}
		}

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
								color: 0xffff00, // color based on latitude of endpoint
								width: 1// random width between 1 and 2
							}

							lineMesh = tb.line(lineOptions);

							tb.add(lineMesh)
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




		map.on('click', '3dzgrade', function(e) {
			map.getSource('currentBuildings').setData({
			  "type": "FeatureCollection",
			  "features": e.features
		});

			console.log(e.features[0].properties);

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


		map.flyTo({
		// These options control the ending camera position: centered at
		// the target, at zoom level 9, and north up.

			zoom: 15.5,
			bearing: 0,
			pitch: 60,
			 
			// These options control the flight curve, making it move
			// slowly and zoom out almost completely before starting
			// to pan.
			speed: 0.2, // make the flying slow
			curve: 1, // change the speed at which it zooms out
			 
			// This can be any easing function: it takes a number between
			// 0 and 1 and returns another number between 0 and 1.
			easing: function (t) {
			return t;
			},
			 
			// this animation is considered essential with respect to prefers-reduced-motion
			essential: true
		});
	});
</script>

</body>
</html>