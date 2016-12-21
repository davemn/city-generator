#pragma strict

private var city: CityConfig;
var meshgen: MeshGenerator;
var watermap: Texture2D;
var heightmap: Texture2D;

function ColorsEqual (a: Color, b: Color) {
	var err: float = Mathf.Abs(a.r - b.r) + Mathf.Abs(a.g - b.g) + Mathf.Abs(a.b - b.b);
	return err < 0.001f;
}

//map val (0-1) to a range with optional weight (default 1.0)
function MapToRange(val: float, min: float, max: float){
	return this.MapToRange(val, min, max, 1.0f);
}

//map val (0-1) to a range with optional weight (default 1.0)
function MapToRange(val: float, min: float, max: float, exp: float){
	var weighted = Mathf.Pow(val, exp);
	//make the highest little higher
	if (val >= 0.9f) 
		weighted = val;
	var num = Mathf.Floor(weighted * (max - min)) + min;
	return num;
}

//recursively create buildings return array of meshes
function SetupBuildings(x, z, w, l, h, sub, color){
	// var street_meshes = new List.<GameObject>();
	SetupBuildings(x,z,w,l,h,sub,color, new List.<GameObject.();
}

function SetupBuildings(x, z, w, l, h, sub, color, buildings){
	var offset, half, between;
	//array of buildings for this block
	buildings = buildings || [];
	var depth = Math.pow(2, city.subdiv);
	var tall = Math.round((h/city.build_max_h)*100) > 90;
	var slice_deviation = 15;
	//really tall buildings take the whole block
	if(sub<1 || tall){
		building = new Building({
			h: getRandInt(h-city.block_h_dev, h+city.block_h_dev),
			w: w, 
			l: l,
			x: x,
			z: z,
			tall:tall,
			color: color
		});
		buildings.push(building.group);
		//add all buildings in this block to scene as a single mesh
		if(buildings.length >= depth || tall){
			scene.add(mergeMeshes(buildings));
		}
	}
	else{
		//recursively slice the block until num of subdivisions met
		//TODO: simplify this
		var dir = (w==l) ? chance(50) : w>l;
		if(dir){
			offset = Math.abs(getRandInt(0, slice_deviation));
			between = (city.inner_block_margin/2);
			half = w/2;
			var x_prime = x + offset; 
			var w1 = Math.abs((x+half)-x_prime) - between;
			var w2 = Math.abs((x-half)-x_prime) - between;
			var x1 = x_prime + (w1/2) + between;
			var x2 = x_prime - (w2/2) - between;
			setupBuildings(x1, z, w1, l, h, sub-1, color, buildings);
			setupBuildings(x2, z, w2, l, h, sub-1, color, buildings);
		}
		else{
			offset = Math.abs(getRandInt(0, slice_deviation));
			between = (city.inner_block_margin/2);
			half = l/2;
			var z_prime = z + offset; 
			var l1 = Math.abs((z+half)-z_prime) - between;
			var l2 = Math.abs((z-half)-z_prime) - between;
			var z1 = z_prime + (l1/2) + between;
			var z2 = z_prime - (l2/2) - between;
			setupBuildings(x, z1, w, l1, h, sub-1, color, buildings);
			setupBuildings(x, z2, w, l2, h, sub-1, color, buildings);
		}
	}
}

function Start () {
	this.city = new CityConfig();
	this.meshgen = GetComponent.<MeshGenerator>();

	/* - Ported code - */

	var curb: GameObject;

	for (var i = 0; i < city.blocks_x; i++) {
		for (var j = 0; j < city.blocks_z; j++) {
			if(this.ColorsEqual (watermap.GetPixel(j,i), Color.white)) {
				var x = ((city.block*i) + city.block/2) - city.width/2;
				var z = ((city.block*j) + city.block/2) - city.length/2;
				//get values from heightmap array
				var hm = heightmap.GetPixel(j,i).grayscale;
				//get building height for block
				var h = MapToRange(hm, city.build_min_h, city.build_max_h, city.build_exp);
				//max possible distance from center of block
				var w = city.block-city.road_w;
				//with inner block margins
				var inner = w-(city.inner_block_margin*2);
				//create curb mesh
				var curb_color = MyColors.GROUND;
				curb = meshgen.getBoxMesh(curb_color, w, city.curb_h, w);
				curb.transform.parent = transform;
				curb.transform.localPosition = new Vector3(x, city.curb_h/2, z);

				//create buildings in debug mode the building color is mapped to the hightmap
				if(hm > city.tree_threshold) {
					// var building_color = DEBUG ? getGreyscaleColor(hm) : colors.BUILDING;
					var building_color = MyColors.BUILDING;
					setupBuildings(x, z, inner, inner,  h, city.subdiv, building_color);
				}
				/* TODO
				//create tree meshes
				else{ setupPark(x, z, inner, inner); }
				*/
			}
		}
	}
}

function Update () {

}