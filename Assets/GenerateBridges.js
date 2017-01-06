#pragma strict

import System.Collections.Generic;

var meshgen: MeshGenerator;
var heightmap: Texture2D;

private var city: CityConfig;
private var buildingContainer: Transform;
private var treeContainer: Transform;

private function ColorToFloat(c: Color): float {
	return c.grayscale;
}

private function MapRowIsFull(n: float): boolean {
	return n < city.tree_threshold;
}

//get rows or columns with no buildings
private function GetEmptyRows(): List.<CityGenerator.MapRow> {
	var rowsColor = new List.<Color>(heightmap.GetPixels());
	var rows = CityGenerator.Lodash.Map(rowsColor, ColorToFloat);

	/* - begin ported code - */
	var i: int;
	var low;
	var lri;
	var lci;
	var empty = new List.<CityGenerator.MapRow>();
	//loop through rows
	for(i=0; i<rows.Count;i++){
		// list of float grayscale vals for the current row
		var row = rows.GetRange(i*heightmap.width, heightmap.width);

		//all values in row are under tree threshold
		row = CityGenerator.Lodash.Reject(row, MapRowIsFull);

		if(row.Count == 0){
			var emptyRow: CityGenerator.MapRow;
			emptyRow.axis = 0;
			emptyRow.index = i;
			empty.Add(emptyRow);
		}
	}
	// TODO continue porting
	//loop through columns
	/*
	for(i=0; i<heightmap[0].length;i++){
		var col = _.map(heightmap, function(row){ return row[i]; });
		col = _.reject(col, function(n) { return n < city.tree_threshold; });
		if(!col.length){
			empty.push({axis: 1, index: i});
		}
	}
	*/
	return empty;
}

function Start () {
	this.city = new CityConfig();
	if(!this.meshgen)
		this.meshgen = GetComponent.<MeshGenerator>();
	
	/* - Ported code - createBridges() */
	//create bridges
	// bridges = _.shuffle(getEmptyRows()).splice(0, city.bridge_max);	
	var bridges = CityGenerator.Lodash.Shuffle(GetEmptyRows());
	bridges.RemoveRange(0, Mathf.FloorToInt(city.bridge_max));

	// TODO continue porting
	/*
	var parts = new List.<GameObject>();
	for(var i=0;i<bridges.length;i++){
		var lx = getCoordinateFromIndex(bridges[i].index, city.width);
		var lz = getCoordinateFromIndex(bridges[i].index, city.length);
		parts.push(getBoxMeshOpts({
			color: colors.BUILDING,
			w: bridges[i].axis ? city.width : city.road_w,
			l: bridges[i].axis ? city.road_w : city.length,
			h: 4,
			y: city.bridge_h+2,
			x: bridges[i].axis ? 0 : lx,
			z: bridges[i].axis ? lz : 0
		}));
		//columns
		for(var j=0;j<(bridges[i].axis ? city.blocks_x : city.blocks_z);j++){
			var h = city.bridge_h+(city.curb_h*2)+(city.water_height);
			parts.push(getBoxMeshOpts({
				color: colors.BUILDING,
				w: 10,
				l: 10,
				h: h,
				y: -((city.curb_h*2)+(city.water_height))+(h/2),
				x: bridges[i].axis ? getCoordinateFromIndex(j, city.width) : lx,
				z: bridges[i].axis ? lz : getCoordinateFromIndex(j, city.length)
			}));
		}
	}
	if(parts.length) scene.add(mergeMeshes(parts));
	*/
}