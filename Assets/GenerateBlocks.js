#pragma strict

import System.Collections.Generic;

var meshgen: MeshGenerator;
var watermap: Texture2D;
var heightmap: Texture2D;

private var buildingContainer: Transform;
private var treeContainer: Transform;

//create park 
function SetupPark(x: float, z: float, w: float, l: float){
	var trees = new List.<GameObject>();
	for(var i=0; i<CityGenerator.Random.GetRandInt(0, City.tree_max);i++){
		var tree_x = CityGenerator.Random.GetRandInt(x-w/2, x+w/2);
		var tree_z = CityGenerator.Random.GetRandInt(z-l/2, z+l/2);
		trees.Add(new ParkTree(tree_x, tree_z, meshgen).group);
	}
	//merge trees for this block into single mesh
	if(trees.Count > 0) {
		var treesMerged: GameObject = meshgen.mergeMeshes(trees.ToArray());
		treesMerged.transform.parent = treeContainer;
	}
}

//recursively create buildings return array of meshes
function SetupBuildings(x: float, z: float, w: float, l: float, h: float, sub: float, color: int){
	// var street_meshes = new List.<GameObject>();
	SetupBuildings(x,z,w,l,h,sub,color, new List.<GameObject>());
}

function SetupBuildings(x: float, z: float, w: float, l: float, h: float, sub: float, color: int, buildings: List.<GameObject>){
	var offset: float;
	var half: float;
	var between: float;
	
	var depth = Mathf.Pow(2, City.subdiv);
	var tall = Mathf.Round((h/City.build_max_h)*100) > 90;
	var slice_deviation = 15;
	
	//really tall buildings take the whole block
	var building: Building;
	if(sub<1 || tall){
		var buildingOpts: BuildingOpts = new BuildingOpts();
		buildingOpts.h = CityGenerator.Random.GetRandInt(h-City.block_h_dev, h+City.block_h_dev);
		buildingOpts.w = w;
		buildingOpts.l = l;
		buildingOpts.x = x;
		buildingOpts.z = z;
		buildingOpts.tall = tall;
		buildingOpts.color = color;

		building = new Building(buildingOpts, meshgen);

		buildings.Add(building.group);
		//add all buildings in this block to scene as a single mesh
		if(buildings.Count >= depth || tall){
			var buildingsMerged: GameObject = meshgen.mergeMeshes(buildings.ToArray());
			// buildingGO.transform.parent = transform;
			buildingsMerged.transform.parent = buildingContainer;
		}
	}
	else{
		//recursively slice the block until num of subdivisions met
		//TODO: simplify this
		var dir = (w==l) ? CityGenerator.Random.Chance(50) : w>l;
		if(dir){
			offset = Mathf.Abs(CityGenerator.Random.GetRandInt(0, slice_deviation));
			between = (City.inner_block_margin/2);
			half = w/2;
			var x_prime = x + offset; 
			var w1 = Mathf.Abs((x+half)-x_prime) - between;
			var w2 = Mathf.Abs((x-half)-x_prime) - between;
			var x1 = x_prime + (w1/2) + between;
			var x2 = x_prime - (w2/2) - between;
			SetupBuildings(x1, z, w1, l, h, sub-1, color, buildings);
			SetupBuildings(x2, z, w2, l, h, sub-1, color, buildings);
		}
		else{
			offset = Mathf.Abs(CityGenerator.Random.GetRandInt(0, slice_deviation));
			between = (City.inner_block_margin/2);
			half = l/2;
			var z_prime = z + offset; 
			var l1 = Mathf.Abs((z+half)-z_prime) - between;
			var l2 = Mathf.Abs((z-half)-z_prime) - between;
			var z1 = z_prime + (l1/2) + between;
			var z2 = z_prime - (l2/2) - between;
			SetupBuildings(x, z1, w, l1, h, sub-1, color, buildings);
			SetupBuildings(x, z2, w, l2, h, sub-1, color, buildings);
		}
	}
}

function Start () {
	if(!this.meshgen)
		this.meshgen = GetComponent.<MeshGenerator>();
	
	this.buildingContainer = transform.Find('Buildings');
	this.treeContainer = transform.Find('Trees');

	/* - Ported code - */

	var curb: GameObject;

	for (var i = 0; i < City.blocks_x; i++) {
		for (var j = 0; j < City.blocks_z; j++) {
			if(CityGenerator.Color.ColorsEqual (watermap.GetPixel(j,i), Color.white)) {
				var x = ((City.block*i) + City.block/2) - City.width/2;
				var z = ((City.block*j) + City.block/2) - City.length/2;
				//get values from heightmap array
				var hm = heightmap.GetPixel(j,i).grayscale;
				//get building height for block
				var h = NumberRange.MapToRange(hm, City.build_min_h, City.build_max_h, City.build_exp);
				//max possible distance from center of block
				var w = City.block-City.road_w;
				//with inner block margins
				var inner = w-(City.inner_block_margin*2);
				//create curb mesh
				var curb_color = CityGenerator.Color.GROUND;
				curb = meshgen.getBoxMesh(curb_color, w, City.curb_h, w);
				curb.transform.parent = transform;
				curb.transform.localPosition = new Vector3(x, City.curb_h/2, z);

				//create buildings in debug mode the building color is mapped to the hightmap
				if(hm > City.tree_threshold) {
					// var building_color = DEBUG ? getGreyscaleColor(hm) : colors.BUILDING;
					var building_color = CityGenerator.Color.BUILDING;
					SetupBuildings(x, z, inner, inner,  h, City.subdiv, building_color);
				}
				//create tree meshes
				else{ SetupPark(x, z, inner, inner); }
			}
		}
	}
}