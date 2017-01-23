#pragma strict

import System.Collections.Generic;
import CityGenerator;

public class GenerateGround extends MonoBehaviour {
	var meshgen: MeshGenerator;
	var watermap: Texture2D;

	function ColorsEqual (a: UnityEngine.Color, b: UnityEngine.Color) {
		var err: float = Mathf.Abs(a.r - b.r) + Mathf.Abs(a.g - b.g) + Mathf.Abs(a.b - b.b);
		return err < 0.001f;
	}

	function Start () {
		// Immediately deactivate placeholder ground, we're going to be generating it instead
		transform.GetChild (0).gameObject.SetActive (false);

		// this.meshgen = GameObject.Find ("/Generators/MeshGenerator").GetComponent.<MeshGenerator>();
		this.meshgen = GetComponent.<MeshGenerator>();

		/* - Ported code - */

		var street_h = City.curb_h*2;
		var earth_meshes = new List.<GameObject>();
		var street_meshes = new List.<GameObject>();
		//lowest ground Layer
		var bedrock = meshgen.getBoxMesh(CityGenerator.Color.LIGHT_BROWN, City.width, City.baze, City.length);
		bedrock.transform.position.y = (-(City.baze/2) - City.water_height - street_h);
		bedrock.GetComponent.<MeshRenderer>().receiveShadows = false;
		bedrock.transform.parent = transform;

		//water layer
		var water = meshgen.getWaterMesh(City.width-2, City.water_height, City.length-2);
		water.transform.position.y = -(City.water_height/2) - street_h; 
		water.transform.parent = transform;

		var earth_mesh: GameObject;
		var street_mesh: GameObject;

		for(var i=0;i<watermap.height;i++){
			for(var j=0;j<watermap.width;j++){
				if(this.ColorsEqual (watermap.GetPixel(j,i), UnityEngine.Color.white)) {
					var x = ((City.block*i) + City.block/2) - City.width/2;
					var z = ((City.block*j) + City.block/2) - City.length/2;

					earth_mesh = meshgen.getBoxMesh(CityGenerator.Color.DARK_BROWN, City.block, City.water_height, City.block, x, (-(City.water_height/2) - street_h), z);
					earth_mesh.transform.parent = transform;

					street_mesh = meshgen.getBoxMesh(CityGenerator.Color.GREY, City.block, street_h, City.block, x, -(street_h/2), z);
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