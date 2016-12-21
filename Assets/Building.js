#pragma strict

import System.Collections.Generic;

public class Building extends MonoBehaviour
{
	public var meshgen: MeshGenerator;

	//map val (0-1) to a range with optional weight (default 1.0)
	private function MapToRange(val: float, min: float, max: float){
		return this.MapToRange(val, min, max, 1.0f);
	}

	//map val (0-1) to a range with optional weight (default 1.0)
	private function MapToRange(val: float, min: float, max: float, exp: float){
		var weighted = Mathf.Pow(val, exp);
		//make the highest little higher
		if (val >= 0.9f) 
			weighted = val;
		var num = Mathf.Floor(weighted * (max - min)) + min;
		return num;
	}

	//get a random int in range
	private function getRandInt(min, max, exp) {
		return mapToRange(Random.value, min, max, exp);
	}

	// TODO move getBoxMeshOpts somewhere to be shared with setupBridges

	//create a box mesh with a geometry and material
	private function getBoxMeshOpts(options: Hashtable) {
		var o=options;
		return meshgen.getBoxMesh(o.color, o.w, o.h, o.l, o.x, o.y, o.z, o.shadow);
	}

	public function Building(opts) {
		this.parts = new List.<GameObject>();
		//50% chance of building having a rim.
		var rim = getRandInt(3,5);
		var inset = getRandInt(2,4);
		var rim_opts = {
			color: opts.color,
			h: rim,
			y: opts.h + (rim/2) + city.curb_h,
			shadow: false
		};
		//building core
		this.parts.Add(getBoxMeshOpts({
			color: opts.color,
			w: opts.w,
			h: opts.h,
			l: opts.l,
			x: opts.x,
			y: (opts.h/2)+city.curb_h,
			z: opts.z,
			shadow: true
		}));
		//draw rim on top of some buildings
		if(chance(50)){
			this.parts.Add(getBoxMeshOpts(_.assign(rim_opts, {
				w: opts.w,
				l: inset,
				x: opts.x,
				z: opts.z - (opts.l/2 - inset/2)
			})));
			this.parts.Add(getBoxMeshOpts(_.assign(rim_opts, {
				w: opts.w,
				l: inset,
				x: opts.x,
				z: opts.z + (opts.l/2 - inset/2)
			})));
			this.parts.Add(getBoxMeshOpts(_.assign(rim_opts, {
				w: inset,
				l: opts.l-(inset*2),
				x: opts.x - (opts.w/2 - inset/2),
				z: opts.z
			})));
			this.parts.Add(getBoxMeshOpts(_.assign(rim_opts, {
				w: inset,
				l: opts.l-(inset*2),
				x: opts.x + (opts.w/2 - inset/2),
				z: opts.z
			})));		
		}
		//additional details
		if(chance(50)){
			this.parts.Add(getBoxMeshOpts(_.assign(rim_opts, {
				w: getRandInt(opts.w/4, opts.w/2),
				l: getRandInt(opts.l/4, opts.l/2),
				x: opts.x - (5*randDir()),
				z: opts.z - (5*randDir())
			})));
		}
		//antenna only on tall buildings
		if(chance(25) && opts.tall){
			this.parts.Add(getBoxMeshOpts(_.assign(rim_opts, {
				w: 3,
				l: 3,
				x: opts.x - (5*randDir()),
				z: opts.z - (5*randDir()),
				h: getRandInt(city.build_max_h/5, city.build_max_h/3)
			})));
		}
		if(chance(25) && opts.tall){
			var top = getBoxMeshOpts(_.assign(rim_opts, {
				w: opts.w - (opts.w/3),
				l: opts.w - (opts.w/3),
				x: opts.x,
				z: opts.z,
				h: getRandInt(15, 30)
			}));
			top.castShadow = false;
			this.parts.Add(top);
		}
		//merged mesh
		var merged = meshgen.mergeMeshes(this.parts.ToArray());
		this.group = merged;
	}
};