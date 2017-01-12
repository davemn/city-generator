#pragma strict

import System.Collections.Generic;

var meshgen: MeshGenerator;
var heightmap: Texture2D;

private var city: CityConfig;
private var buildingContainer: Transform;
private var treeContainer: Transform;
private var heightmapGray: List.<float>;

private function ColorToFloat(c: Color): float {
	return c.grayscale;
}

private function BlockHasTrees(n: float): boolean {
	return n <= city.tree_threshold;
}

private function GetHeightmapRow(row: int): List.<float> {
	var px = this.heightmapGray;
	return px.GetRange(row*heightmap.width, heightmap.width);
}

private function GetHeightmapColumn(column: int): List.<float> {
	var px = this.heightmapGray;
	var columnList = new List.<float>();
	for(var r=0; r < heightmap.height; r++){
		columnList.Add(px[r*heightmap.width + column]);
	}
	return columnList;
}

//get rows or columns with no buildings
private function GetEmptyRows(): List.<CityGenerator.MapRow> {
	/* - begin ported code - */
	var i: int;
	var low;
	var lri;
	var lci;
	var empty = new List.<CityGenerator.MapRow>();
	//loop through rows
	for(i=0; i<heightmap.height;i++){
		// list of float grayscale vals for the current row
		var row = GetHeightmapRow(i);

		//all values in row are over tree threshold
		row = CityGenerator.Lodash.Reject(row, BlockHasTrees);

		if(row.Count == 0){
			var emptyRow: CityGenerator.MapRow;
			emptyRow.axis = 0;
			emptyRow.index = i;
			empty.Add(emptyRow);
		}
	}

	//loop through columns
	for(i=0; i<heightmap.width;i++){
		var col = GetHeightmapColumn(i);

		col = CityGenerator.Lodash.Reject(col, BlockHasTrees);
		if(col.Count == 0){
			var emptyCol: CityGenerator.MapRow;
			emptyCol.axis = 1;
			emptyCol.index = i;
			empty.Add(emptyCol);
		}
	}
	return empty;
}

//get x,z from index
private function GetCoordinateFromIndex(index: float, offset: float) {
	return (-(offset/2f) + (index * city.block)) + (city.block/2f);
}

//create a box mesh with a geometry and material
private function GetBoxMeshOpts(options: MeshOpts) {
	var o=options;
	return meshgen.getBoxMesh(o.color, o.w, o.h, o.l, o.x, o.y, o.z, o.shadow);
}

/* --- */

function Start () {
	this.city = new CityConfig();
	if(!this.meshgen)
		this.meshgen = GetComponent.<MeshGenerator>();

	var heightmapColor = new List.<Color>(heightmap.GetPixels());
	this.heightmapGray = CityGenerator.Lodash.Map(heightmapColor, ColorToFloat);
	
	/* - Ported code - createBridges() */
	//create bridges
	var bridges: List.<CityGenerator.MapRow> = CityGenerator.Lodash.Shuffle(GetEmptyRows());
	if(bridges.Count > 0) // for parity with Array.splice()
		bridges = bridges.GetRange(0, Mathf.Min(Mathf.FloorToInt(city.bridge_max), bridges.Count));

	var parts = new List.<GameObject>();
	for(var i=0;i<bridges.Count;i++){
		var lx = GetCoordinateFromIndex(bridges[i].index, city.width);
		var lz = GetCoordinateFromIndex(bridges[i].index, city.length);

		var partsOpts = new MeshOpts();
		partsOpts.color = CityGenerator.Color.BUILDING;
		partsOpts.w = (bridges[i].axis == 1) ? city.width : city.road_w;
		partsOpts.l = (bridges[i].axis == 1) ? city.road_w : city.length;
		partsOpts.h = 4;
		partsOpts.y = city.bridge_h+2;
		partsOpts.x = bridges[i].axis ? 0 : lx;
		partsOpts.z = bridges[i].axis ? lz : 0;
		partsOpts.shadow = true;

		parts.Add(GetBoxMeshOpts(partsOpts));

		//columns
		for(var j=0;j<((bridges[i].axis == 1) ? city.blocks_x : city.blocks_z);j++){
			var h = city.bridge_h+(city.curb_h*2)+(city.water_height);

			partsOpts.color = CityGenerator.Color.BUILDING;
			partsOpts.w = 10;
			partsOpts.l = 10;
			partsOpts.h = h;
			partsOpts.y = -((city.curb_h*2)+(city.water_height))+(h/2);
			partsOpts.x = (bridges[i].axis == 1) ? GetCoordinateFromIndex(j, city.width) : lx;
			partsOpts.z = (bridges[i].axis == 1) ? lz : GetCoordinateFromIndex(j, city.length);

			parts.Add(GetBoxMeshOpts(partsOpts));
		}
	}
	if(parts.Count > 0) {
		var merged = meshgen.mergeMeshes(parts.ToArray());
		merged.transform.parent = transform;
	}
}