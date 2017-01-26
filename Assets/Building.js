#pragma strict

import System.Collections.Generic;
import CityGenerator;

public class Building
{
	public var group: GameObject;

	// TODO move getBoxMeshOpts somewhere to be shared with setupBridges

	//create a box mesh with a geometry and material
	private function GetBoxMeshOpts(options: MeshOpts) {
		var o=options;
		return meshgen.getBoxMesh(o.color, o.w, o.h, o.l, o.x, o.y, o.z, o.shadow);
	}

	private var meshgen: MeshGenerator;
	private var parts: List.<GameObject>;

	public function Building(opts: BuildingOpts, meshgen: MeshGenerator) {
		this.meshgen = meshgen;
	
		this.parts = new List.<GameObject>();
		//50% chance of building having a rim.
		var rim: float = CityGenerator.Random.GetRandInt(3,5);
		var inset: float = CityGenerator.Random.GetRandInt(2,4);

		var rim_opts: MeshOpts = new MeshOpts();
		rim_opts.color = opts.color;
		rim_opts.h = rim;
		rim_opts.y = opts.h + (rim/2) + City.curb_h;
		rim_opts.shadow = false;

		var core_opts = new MeshOpts();
		core_opts.color = opts.color;
		core_opts.w = opts.w;
		core_opts.h = opts.h;
		core_opts.l = opts.l;
		core_opts.x = opts.x;
		core_opts.y = (opts.h/2)+City.curb_h;
		core_opts.z = opts.z;
		core_opts.shadow = true;

		//building core
		this.parts.Add(GetBoxMeshOpts(core_opts));
		//draw rim on top of some buildings
		if(CityGenerator.Random.Chance(50)){
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
		if(CityGenerator.Random.Chance(50)){
			rim_opts.w = CityGenerator.Random.GetRandInt(opts.w/4, opts.w/2);
			rim_opts.l = CityGenerator.Random.GetRandInt(opts.l/4, opts.l/2);
			rim_opts.x = opts.x - (5*CityGenerator.Random.RandDir());
			rim_opts.z = opts.z - (5*CityGenerator.Random.RandDir());
		
			this.parts.Add(GetBoxMeshOpts(rim_opts));
		}
		//antenna only on tall buildings
		if(CityGenerator.Random.Chance(25) && opts.tall){
			rim_opts.w = 3;
			rim_opts.l = 3;
			rim_opts.x = opts.x - (5*CityGenerator.Random.RandDir());
			rim_opts.z = opts.z - (5*CityGenerator.Random.RandDir());
			rim_opts.h = CityGenerator.Random.GetRandInt(City.build_max_h/5, City.build_max_h/3);
		
			this.parts.Add(GetBoxMeshOpts(rim_opts));
		}
		if(CityGenerator.Random.Chance(25) && opts.tall){
			rim_opts.w = opts.w - (opts.w/3);
			rim_opts.l = opts.w - (opts.w/3);
			rim_opts.x = opts.x;
			rim_opts.z = opts.z;
			rim_opts.h = CityGenerator.Random.GetRandInt(15, 30);
		
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