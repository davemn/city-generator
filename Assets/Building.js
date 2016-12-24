#pragma strict

import System.Collections.Generic;

public class Building
{
	public var meshgen: MeshGenerator;

	// TODO move getBoxMeshOpts somewhere to be shared with setupBridges

	//create a box mesh with a geometry and material
	private function GetBoxMeshOpts(options: MeshOpts) {
		var o=options;
		return meshgen.getBoxMesh(o.color, o.w, o.h, o.l, o.x, o.y, o.z, o.shadow);
	}
	
	// TODO move random util funcs into static class
	
	//returns true percent of the time
	private function Chance(percent: float) {
		return Random.value < (percent/100.0f);
	}
	
	//return 1 or -1
	private function RandDir(){
		return Mathf.Round(Random.value) * 2 - 1;
	}
	
	private var parts: List.<GameObject>();
	private var group: GameObject;

	public function Building(opts: BuildingOpts) {
		this.parts = new List.<GameObject>();
		//50% chance of building having a rim.
		var rim = NumberRange.GetRandInt(3,5);
		var inset = NumberRange.GetRandInt(2,4);

		var rim_opts: MeshOpts = new MeshOpts();
		rim_opts.color = opts.color;
		rim_opts.h = rim;
		rim_opts.y = opts.h + (rim/2) + city.curb_h;
		rim_opts.shadow = false;

		var core_opts = new MeshOpts;
		core_opts.color = opts.color;
		core_opts.w = opts.w;
		core_opts.h = opts.h;
		core_opts.l = opts.l;
		core_opts.x = opts.x;
		core_opts.y = (opts.h/2)+city.curb_h;
		core_opts.z = opts.z;
		core_opts.shadow = true;

		//building core
		this.parts.Add(GetBoxMeshOpts(core_opts));
		//draw rim on top of some buildings
		if(Chance(50)){
			rim_opts.w = opts.w;
			rim_opts.l = inset;
			rim_opts.x = opts.x;
			rim_opts.z = opts.z - (opts.l/2 - inset/2);
			
			this.parts.Add(GetBoxMeshOpts(rim_opts));
			
			rim_opts.w = opts.w;
			rim_opts.l = inset;
			rim_opts.x = opts.x;
			rim_opts.z = opts.z + (opts.l/2 - inset/2);
			
			this.parts.Add(GetBoxMeshOpts(rim_opts));
			
			rim_opts.w = inset;
			rim_opts.l = opts.l-(inset*2);
			rim_opts.x = opts.x - (opts.w/2 - inset/2);
			rim_opts.z = opts.z;
			
			this.parts.Add(GetBoxMeshOpts(rim_opts));
			
			rim_opts.w = inset;
			rim_opts.l = opts.l-(inset*2);
			rim_opts.x = opts.x - (opts.w/2 - inset/2);
			rim_opts.z = opts.z;			
			
			this.parts.Add(GetBoxMeshOpts(rim_opts));
		}
		//additional details
		if(Chance(50)){
			rim_opts.w = NumberRange.GetRandInt(opts.w/4, opts.w/2);
			rim_opts.l = NumberRange.GetRandInt(opts.l/4, opts.l/2);
			rim_opts.x = opts.x - (5*RandDir());
			rim_opts.z = opts.z - (5*RandDir());
		
			this.parts.Add(GetBoxMeshOpts(rim_opts));
		}
		//antenna only on tall buildings
		if(Chance(25) && opts.tall){
			rim_opts.w = 3;
			rim_opts.l = 3;
			rim_opts.x = opts.x - (5*RandDir());
			rim_opts.z = opts.z - (5*RandDir());
			rim_opts.h = NumberRange.GetRandInt(city.build_max_h/5, city.build_max_h/3);
		
			this.parts.Add(GetBoxMeshOpts(rim_opts));
		}
		if(chance(25) && opts.tall){
			rim_opts.w = opts.w - (opts.w/3);
			rim_opts.l = opts.w - (opts.w/3);
			rim_opts.x = opts.x;
			rim_opts.z = opts.z;
			rim_opts.h = NumberRange.GetRandInt(15, 30);
		
			var top: GameObject = GetBoxMeshOpts(rim_opts);
			
			var topRend: MeshRenderer = top.GetComponent.<MeshRenderer>();
			topRend.shadowCastingMode = Rendering.ShadowCastingMode.Off;
			
			this.parts.Add(top);
		}
		//merged mesh
		var merged = meshgen.mergeMeshes(this.parts.ToArray());
		this.group = merged;
	}
};