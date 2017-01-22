#pragma strict

import System.Collections.Generic;
import CityGenerator;

var meshgen: MeshGenerator;
var heightmap: Texture2D;

private var buildingContainer: Transform;
private var treeContainer: Transform;
private var heightmapGray: List.<float>;

private function ColorToFloat(c: UnityEngine.Color): float {
	return c.r;
}

private function BlockHasTrees(n: float): boolean {
	return n <= City.tree_threshold;
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
	return (-(offset/2f) + (index * City.block)) + (City.block/2f);
}

//create a box mesh with a geometry and material
private function GetBoxMeshOpts(options: MeshOpts) {
	var o=options;
	return meshgen.getBoxMesh(o.color, o.w, o.h, o.l, o.x, o.y, o.z, o.shadow);
}

/* --- */

function Start () {
	if(!this.meshgen)
		this.meshgen = GetComponent.<MeshGenerator>();

	var heightmapColor = new List.<UnityEngine.Color>(heightmap.GetPixels());
	this.heightmapGray = CityGenerator.Lodash.Map(heightmapColor, ColorToFloat);
	
	/* - Ported code - createBridges() */
	//create bridges
	var bridges: List.<CityGenerator.MapRow> = CityGenerator.Lodash.Shuffle(GetEmptyRows());
	if(bridges.Count > 0) // for parity with Array.splice()
		bridges = bridges.GetRange(0, Mathf.Min(Mathf.FloorToInt(City.bridge_max), bridges.Count));

	var parts = new List.<GameObject>();
	for(var i=0;i<bridges.Count;i++){
		var lx = GetCoordinateFromIndex(bridges[i].index, City.width);
		var lz = GetCoordinateFromIndex(bridges[i].index, City.length);

		var partsOpts = new MeshOpts();
		partsOpts.color = CityGenerator.Color.BUILDING;
		partsOpts.w = (bridges[i].axis == 1) ? City.width : City.road_w;
		partsOpts.l = (bridges[i].axis == 1) ? City.road_w : City.length;
		partsOpts.h = 4;
		partsOpts.y = City.bridge_h+2;
		partsOpts.x = bridges[i].axis ? 0 : lx;
		partsOpts.z = bridges[i].axis ? lz : 0;
		partsOpts.shadow = true;

		parts.Add(GetBoxMeshOpts(partsOpts));

		//columns
		for(var j=0;j<((bridges[i].axis == 1) ? City.blocks_x : City.blocks_z);j++){
			var h = City.bridge_h+(City.curb_h*2)+(City.water_height);

			partsOpts.color = CityGenerator.Color.BUILDING;
			partsOpts.w = 10;
			partsOpts.l = 10;
			partsOpts.h = h;
			partsOpts.y = -((City.curb_h*2)+(City.water_height))+(h/2);
			partsOpts.x = (bridges[i].axis == 1) ? GetCoordinateFromIndex(j, City.width) : lx;
			partsOpts.z = (bridges[i].axis == 1) ? lz : GetCoordinateFromIndex(j, City.length);

			parts.Add(GetBoxMeshOpts(partsOpts));
		}
	}
	if(parts.Count > 0) {
		var merged = meshgen.mergeMeshes(parts.ToArray());
		merged.transform.parent = transform;
	}
}