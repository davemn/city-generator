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
				var h = mapToRange(hm, city.build_min_h, city.build_max_h, city.build_exp);
				//max possible distance from center of block
				var w = city.block-city.road_w;
				//with inner block margins
				var inner = w-(city.inner_block_margin*2);
				//create curb mesh
				var curb_color = MyColors.GROUND;
				curb = meshgen.getBoxMesh(curb_color, w, city.curb_h, w);
				curb.transform.parent = transform;
				curb.transform.localPosition = new Vector3(x, city.curb_h/2, z);

				/* TODO
				//create buildings in debug mode the building color is mapped to the hightmap
				if(hm > city.tree_threshold) {
					var building_color = DEBUG ? getGreyscaleColor(hm) : colors.BUILDING;
					setupBuildings(x, z, inner, inner,  h, city.subdiv, building_color);
				}
				//create tree meshes
				else{ setupPark(x, z, inner, inner); }
				*/
			}
		}
	}
}

function Update () {

}