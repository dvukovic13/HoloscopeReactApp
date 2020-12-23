/// <reference path='babylon.d.ts' />

var degrees2meters = function(lon,lat) {
  	var x = lon * 20037508.34 / 180;
 	var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
 	y = y * 20037508.34 / 180;
  	return [x, y]
}

var meters2degress = function(x,y) {
	x*=10;
	y*=10;
	var lon = x  *  180 / 20037508.34 ;
	//thanks magichim @ github for the correction
	var lat =  Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90; 
	return [lon, lat]
}


export function nazad() {
    location.replace("./index.php");
} 



const canvas = document.getElementById('renderCanvas');

const engine = new BABYLON.Engine(canvas, true);

const getParams = window.atob(window.location.search.substring(1));
var buildingJSON = JSON.parse(getParams);

console.log(buildingJSON.features[0].id);


var bCoordinates = buildingJSON.features[0].geometry.coordinates;
var bID = buildingJSON.features[0].properties.id;

console.log(bID);
var baseHeight = buildingJSON.features[0].properties.base_height;
var bHeight = buildingJSON.features[0].properties.height - baseHeight;

var points = new Array();
var nodes= new Array();

var linijeGeoJSON = {
    "name":"MyFeatureType",
    "type":"FeatureCollection",
    "features":[]
};

function createScene(){

	//localStorage.clear();
	
	for(var i =0; i<bCoordinates[0].length; i++){
		points[i] = new BABYLON.Vector3(degrees2meters(bCoordinates[0][i][0], bCoordinates[0][i][1])[0]/10, degrees2meters(bCoordinates[0][i][0], bCoordinates[0][i][1])[1]/10, 0);
		//const kutija = BABYLON.MeshBuilder.CreateBox("kutijica")	
	}
	points.pop();
	points.reverse();
	
	

	//console.log(points[0]);
	console.log(bCoordinates[0][0][0], bCoordinates[0][0][1]);

	

	const scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0.203, 0.2, 0.196);

	///////////////////////////
	// PREDEFINISANI CVOROVI //
	///////////////////////////

	/*for(i=0;i<points.length;i++){
		
		nodes[i] = BABYLON.MeshBuilder.CreateSphere("node", {diameter:0.5}, scene);
		nodes[i].position = new BABYLON.Vector3(points[i].x, 0, points[i].y);

		nodes[i+points.length-1] = BABYLON.MeshBuilder.CreateSphere("node", {diameter:0.5}, scene);
		nodes[i+points.length-1].position = new BABYLON.Vector3(points[i].x, -(bHeight/10), points[i].y);

	}*/
	
	const camera = new BABYLON.UniversalCamera('camera', new BABYLON.Vector3(points[points.length-2].x, (bHeight + baseHeight)/2.5, points[points.length-2].y-20), scene);
	//const camera = new BABYLON.ArcRotateCamera('camera',0,0,10, new BABYLON.Vector3(points[points.length-2].x, (bHeight + baseHeight)/2.5, points[points.length-2].y-20), scene);	
	//console.log(camera.position);
	
	camera.rotation.x = 0.5;
	camera.attachControl(canvas, true);


	const light  = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);


	//console.log(nodes[0].position);
	
	var gizmoManager = new BABYLON.GizmoManager(scene);
	gizmoManager.positionGizmoEnabled = true;


	var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var text1 = new BABYLON.GUI.TextBlock();
    text1.text = "Koordinate: \nVisina: ";
    text1.color = "yellow";
    text1.fontSize = 16;
    text1.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
   	text1.left = "10px";
    
    advancedTexture.addControl(text1);
    
    var inputLon = new BABYLON.GUI.InputText();
    var inputLat = new BABYLON.GUI.InputText();
    var inputHeight = new BABYLON.GUI.InputText();

    inputLon.width = 0.08;
    inputLon.maxWidth = 0.2;
    inputLon.height = "40px";
    inputLon.color = "white";
    inputLon.left = "-320px";
    inputLon.top = "-5px";
    inputLon.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    inputLon.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    inputLat.width = 0.08;
    inputLat.maxWidth = 0.2;
    inputLat.height = "40px";
    inputLat.color = "white";
    inputLat.left = "-160px";
    inputLat.top = "-5px";
    inputLat.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    inputLat.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    inputHeight.width = 0.08;
    inputHeight.maxWidth = 0.2;
    inputHeight.height = "40px";
    inputHeight.color = "white";
    inputHeight.top = "-5px";
    //inputHeight.left = "-50px";
    inputHeight.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    inputHeight.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

    advancedTexture.addControl(inputLon);
    advancedTexture.addControl(inputLat);
    advancedTexture.addControl(inputHeight);

    var textUnesi = new BABYLON.GUI.TextBlock();
    textUnesi.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    textUnesi.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    textUnesi.top = "-50px";
    textUnesi.left = "-250px";
    textUnesi.color = "white";
    textUnesi.text = "Unesi ručno: (lon, lat, visina)";

    advancedTexture.addControl(textUnesi);

	var bColor = new BABYLON.StandardMaterial(scene);
	bColor.alpha = .5;
	bColor.diffuseColor = new BABYLON.Color3(0.2705, 0.8313, 0.9686 );

	var pickedColor = new BABYLON.StandardMaterial(scene);
	pickedColor.alpha = 1;
	pickedColor.diffuseColor = new BABYLON.Color3(0, 0.9, 0.2);

	

	const polygon_triangulation = new BABYLON.PolygonMeshBuilder("zgrada", points);
	const polygon = polygon_triangulation.build(false, bHeight/10);
	polygon.position.y = (bHeight+baseHeight)/10;
	polygon.material=bColor;
	//polygon.isPickable = false;


	var hl = new BABYLON.HighlightLayer("hl1", scene);
	var linePointsArray = [];
	var linePoints = [];
	var brojac = 0;
	var pickedOrder = new Array();
	var nodeOrder = new Array();
	
	var lines;
	var delBrojac = 0;
	scene.onPointerUp = function(evt, pickResult) {} // onPointerUp Left

	//////////////////////////////////////
	//  STARA FUNKCIJA CRTANJA LINIJA   //
	// potrebno ubaciti predefinisane  //
	// cvorove i izmijeniti update f-ju //
	//////////////////////////////////////

	/*scene.onPointerUp = (e, pickResult) => {
			//console.log(e.button);
			if(e.button === 0) {
				console.log(pickResult.pickedPoint);
				if(pickResult.hit) {

					if(pickResult.pickedMesh.name=="node"){


						if(scene.getMeshByName("lines")!=null){
							scene.removeMesh(scene.getMeshByName("lines"));
						}


						linePoints.push(pickResult.pickedMesh.position);
						linePointsArray[brojac] = linePoints;


						hl.addMesh(pickResult.pickedMesh, BABYLON.Color3.Green());
						pickedOrder.push(pickResult.pickedMesh);

						if(pickedOrder.length>2){
							if (pickedOrder[pickedOrder.length-2].name == pickResult.pickedMesh.name) {
								console.log("PIKO SI ISTU");
								brojac++;
							}
						}
						
						console.log(pickResult.pickedPoint);
						//console.log(pickedOrder[pickedOrder.length-1].name);

						
						console.log(linePoints);

						lines = BABYLON.MeshBuilder.CreateLines("lines", {
							points: linePoints,
							updatable: true
						}, scene, true);
				}
			}
		}
		if(e.button === 1) {
			console.log(pickResult.pickedPoint);

			var newNode = BABYLON.MeshBuilder.CreateSphere("node", {diameter:0.5}, scene);
			newNode.position = pickResult.pickedPoint;
		}

	}*/
	////////////////////////////////////////////////////////////////

	/////////////////////////
	//  NOVA F-JA CRTANJA  //
	/////////////////////////



	function mousemovef(){
		var pickResult = scene.pick(scene.pointerX, scene.pointerY);

		if(pickResult.hit){
			//console.log("Pikovana tacka: " + pickResult.pickedPoint.x);
			var lon = meters2degress(pickResult.pickedPoint.x, pickResult.pickedPoint.z)[0];
			var lat = meters2degress(pickResult.pickedPoint.x, pickResult.pickedPoint.z)[1];
			var lHeight = pickResult.pickedPoint.y*10;
			text1.text = "Koordinate: lon: " + lon.toPrecision(9).toString() +"   lat: " +lat.toPrecision(9).toString()+ "\nVisina: " + lHeight.toPrecision(4)+"m";
		}
		else{
			 text1.text = "Koordinate: \nVisina: ";
		}

	}


	scene.onPointerMove = function() {
		
		mousemovef();
	}


	scene.onPointerUp = (e, pickResult) => {

			
	//	console.log(scene.pointerX, scene.pointerY);
			//console.log(e.button);
			if(e.button === 0) {
			//	console.log([pickResult.pickedPoint.x, pickResult.pickedPoint.z]);
				if(pickResult.hit) {
					console.log([pickResult.pickedMesh.position.x, pickResult.pickedMesh.position.y] );
					if(pickResult.pickedMesh.name!="node"){
						if(scene.meshes!=null)
							scene.meshes.forEach(mesh => {if (mesh.name == "node") mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);})

						if(scene.getMeshByName("lines")!=null){
							scene.removeMesh(scene.getMeshByName("lines"));
						}
						//console.log(pickResult.pickedPoint.x);

						pickedOrder.push(pickResult.pickedPoint);
						linePoints.push(pickResult.pickedPoint);

						
						linijeGeoJSON.features.push({ "type": "Feature","geometry": {"type": "Point","coordinates": []},"properties": {"height": 0} });
						var lon = meters2degress(pickResult.pickedPoint.x, pickResult.pickedPoint.z)[0];
						var lat = meters2degress(pickResult.pickedPoint.x, pickResult.pickedPoint.z)[1];
						var lHeight = pickResult.pickedPoint.y * 10;

						

						console.log("lon " + lon + " lat "+lat);

						//linijeGeoJSON.features[brojac].geometry.coordinates.push([lon, lat]);
						linijeGeoJSON.features[brojac].geometry.coordinates = [lon,lat];
						linijeGeoJSON.features[brojac].properties.height = lHeight;



						localStorage.setItem('linijeJSON', JSON.stringify(linijeGeoJSON, null, 4));
						console.log('retrievedObject: ', JSON.parse(localStorage.getItem('linijeJSON')));
						
						
						//const jsonData = JSON.stringify(linijeGeoJSON, null, 4);
						
						//console.log(JSON.stringify(linijeGeoJSON));
						delBrojac++;
						brojac++;
						
						//console.log("brojac: "+brojac);	
						

						
						var newNode = BABYLON.MeshBuilder.CreateSphere("node", {diameter:0.3}, scene);
						//var newNode = BABYLON.MeshBuilder.CreateBox("node", {size:0.3}, scene);
						newNode.position = pickResult.pickedPoint;
						newNode.material = new BABYLON.StandardMaterial(scene);
						newNode.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
						nodeOrder.push(newNode);
						//hl.addMesh(newNode, BABYLON.Color3.Green());

						linePointsArray[brojac] = linePoints;


						
						

						if(pickedOrder.length>2){
							updatePath();
							if (pickedOrder[pickedOrder.length-2].name == pickResult.pickedMesh.name) {
								console.log("PIKO SI ISTU");
								
							}
						}
						
						//console.log(pickResult.pickedPoint);
						//console.log(pickedOrder[pickedOrder.length-1].name);

						
						//console.log(linePoints);

						lines = BABYLON.MeshBuilder.CreateLines("lines", {
							points: linePoints,
							updatable: true

						}, scene, true);
						lines.color = new BABYLON.Color3(1, 1, 0);
						//console.log(lines);
				}
				if(pickResult.pickedMesh.name=="node"){
					if(scene.meshes!=null)
							scene.meshes.forEach(mesh => {if (mesh.name == "node") mesh.material.diffuseColor = new BABYLON.Color3(1,1,0);})
					pickResult.pickedMesh.material.diffuseColor = new BABYLON.Color3(1, 0.647, 0);
				}
				
				


			}
		}


		if(e.button === 1) {
			//console.log(pickResult.pickedPoint);

			var newNode = BABYLON.MeshBuilder.CreateSphere("node", {diameter:0.5}, scene);
			newNode.position = pickResult.pickedPoint;
		}


		if(e.button === 2) {
			if(pickResult.hit) {
				if(pickResult.pickedMesh.name=="node"){

					//brojac--;

					console.log("DESNI KLIK NA NODE");
					console.log("brojac: "+brojac);
					console.log(nodeOrder.indexOf(pickResult.pickedMesh));
					//console.log(linePoints);

					// KAKO KADA UZASTOPNO BRISE?

					for(var i = nodeOrder.indexOf(pickResult.pickedMesh);i<delBrojac;i++){
						linePoints.pop();
						pickedOrder.pop();
						nodeOrder.pop();
						
						

					}
					delBrojac= brojac;
					// KAKO DISPOSOVATI SE I SVIH "NAREDNIH" CVOROVA?
					pickResult.pickedMesh.dispose();

					if(scene.getMeshByName("lines")!=null){
						scene.removeMesh(scene.getMeshByName("lines"));
							//lines = BABYLON.Mesh.CreateLines(null, linePoints, null, null, lines);

					}

				}
			}
		}

		

	}

	////////////////////////////////////////////////////



	/*console.log(polygon_triangulation);
	console.log(polygon.position);
	console.log(polygon);
	console.log(camera.position);*/


	var updatePath = function(){
		
		linePoints = [];
		
		for(var i = 0; i < nodeOrder.length;i++){
			linePoints.push(nodeOrder[i].position);
			

			var lon = meters2degress(linePoints[i].x, linePoints[i].z)[0];
			var lat = meters2degress(linePoints[i].x, linePoints[i].z)[1];
			//console.log("lon " + lon + " lat "+ lat);
			linijeGeoJSON.features[i].geometry.coordinates = [lon,lat];
			linijeGeoJSON.features[i].properties.height = linePoints[i].y*10;
		}

		
		localStorage.setItem('linijeJSON', JSON.stringify(linijeGeoJSON, null, 4));
		//console.log("UPDATOVANO" + linePoints);
	}

	scene.registerBeforeRender(function () {
		
		updatePath();

		lines = BABYLON.Mesh.CreateLines(null, linePoints, null, null, lines);

	});

	scene.onReadyObservable.add(function(){
            camera.onRadiusChange = new BABYLON.Observable();
            camera.onRadiusChange.add(function(value) {       
                console.log(camera.radius);
            });
            camera.onRadiusChange.notifyObservers(camera.radius);
        });

    scene.onBeforeRenderObservable.add(function(){
       // text1.text = camera.radius.toFixed() + " m";
    });
   
    scene.onKeyboardObservable.add((kbInfo) => {
	    if(kbInfo.event.keyCode==13){
	    	if(kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN){
		    	if(inputLon.text && inputLat.text && inputHeight.text){

		    		console.log("ima");
		    		var lon = degrees2meters(parseFloat(inputLon.text), parseFloat(inputLat.text))[0]/10;
					var lat = degrees2meters(parseFloat(inputLon.text), parseFloat(inputLat.text))[1]/10;
					var lHeight = parseFloat(inputHeight.text)/10;
					console.log(brojac);

		    		linePoints.push(new BABYLON.Vector3(lon,lHeight,lat));
		    		console.log(linePoints);

		    		var newNode = BABYLON.MeshBuilder.CreateSphere("node", {diameter:0.3}, scene);
					//var newNode = BABYLON.MeshBuilder.CreateBox("node", {size:0.3}, scene);
					newNode.position = new BABYLON.Vector3(lon,lHeight,lat);
					newNode.material = new BABYLON.StandardMaterial(scene);
					newNode.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
					nodeOrder.push(newNode);
					pickedOrder.push(new BABYLON.Vector3(lon,lHeight,lat));
		    		//updatePath();

		    		linijeGeoJSON.features.push({ "type": "Feature","geometry": {"type": "Point","coordinates": []},"properties": {"height": 0} });
		    		linijeGeoJSON.features[brojac].geometry.coordinates = [lon,lat];
					linijeGeoJSON.features[brojac].properties.height = lHeight-baseHeight;

					brojac++;
					console.log(brojac);

					updatePath();

					//lines = BABYLON.Mesh.CreateLines(null, linePoints, null, null, lines);
					lines = BABYLON.MeshBuilder.CreateLines("lines", {
							points: linePoints,
							updatable: true

						}, scene, true);
						lines.color = new BABYLON.Color3(1, 1, 0);

						inputLon.text = parseFloat(inputLon.text).toFixed(2).toString();
						inputLat.text = parseFloat(inputLat.text).toFixed(2).toString();
						

		    	}

		    	else
		    		//console.log("mane");
		    	window.alert("Niste unijeli sve koordinate!");
	    	}	
	    		
	    	//console.log(parseFloat(inputLon.text));
	    }
});

	return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
	scene.render();
});