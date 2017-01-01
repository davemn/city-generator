#pragma strict

import System.Collections.Generic;

public class GenerateGround extends MonoBehaviour {

	var city: CityConfig;
	var meshgen: MeshGenerator;
	var watermap: Texture2D;

	function ColorsEqual (a: Color, b: Color) {
		var err: float = Mathf.Abs(a.r - b.r) + Mathf.Abs(a.g - b.g) + Mathf.Abs(a.b - b.b);
		return err < 0.001f;
	}

	function Start () {
		// Immediately deactivate placeholder ground, we're going to be generating it instead
		transform.GetChild (0).gameObject.SetActive (false);

		this.city = new CityConfig();
		// this.meshgen = GameObject.Find ("/Generators/MeshGenerator").GetComponent.<MeshGenerator>();
		this.meshgen = GetComponent.<MeshGenerator>();

		/* - Ported code - */

		var street_h = city.curb_h*2;
		var earth_meshes = new List.<GameObject>();
		var street_meshes = new List.<GameObject>();
		//lowest ground Layer
		var bedrock = meshgen.getBoxMesh(CityGenerator.Color.LIGHT_BROWN, city.width, city.baze, city.length);
		bedrock.transform.position.y = (-(city.baze/2) - city.water_height - street_h);
		bedrock.GetComponent.<MeshRenderer>().receiveShadows = false;
		bedrock.transform.parent = transform;

		//water layer
		var water = meshgen.getWaterMesh(city.width-2, city.water_height, city.length-2);
		water.transform.position.y = -(city.water_height/2) - street_h; 
		water.transform.parent = transform;

		var earth_mesh: GameObject;
		var street_mesh: GameObject;

		for(var i=0;i<watermap.height;i++){
			for(var j=0;j<watermap.width;j++){
				if(this.ColorsEqual (watermap.GetPixel(j,i), Color.white)) {
					var x = ((city.block*i) + city.block/2) - city.width/2;
					var z = ((city.block*j) + city.block/2) - city.length/2;

					earth_mesh = meshgen.getBoxMesh(CityGenerator.Color.DARK_BROWN, city.block, city.water_height, city.block, x, (-(city.water_height/2) - street_h), z);
					earth_mesh.transform.parent = transform;

					street_mesh = meshgen.getBoxMesh(CityGenerator.Color.GREY, city.block, street_h, city.block, x, -(street_h/2), z);
					street_mesh.transform.parent = transform;

					earth_meshes.Add (earth_mesh);
					street_meshes.Add (street_mesh);
				}
			}	
		}
		
		if(street_meshes.Count > 0) {
			var street_merged = meshgen.mergeMeshes(street_meshes.ToArray());
			street_merged.transform.parent = transform;
		}
		if(earth_meshes.Count > 0) {
			var earth_merged = meshgen.mergeMeshes(earth_meshes.ToArray(), false);
			earth_merged.transform.parent = transform;
		}
	}

	function Update () {

	}
}