#pragma strict

import System.Collections.Generic;

public class Building
{
	public var meshgen: MeshGenerator;

	// TODO move getBoxMeshOpts somewhere to be shared with setupBridges

	//create a box mesh with a geometry and material
	private function getBoxMeshOpts(options: MeshOpts) {
		var o=options;
		return meshgen.getBoxMesh(o.color, o.w, o.h, o.l, o.x, o.y, o.z, o.shadow);
	}

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
		this.parts.Add(getBoxMeshOpts(core_opts));
		//draw rim on top of some buildings
		if(chance(50)){
			// TODO replace _.assign calls with direct override of `rim_opts` fields
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
				w: NumberRange.GetRandInt(opts.w/4, opts.w/2),
				l: NumberRange.GetRandInt(opts.l/4, opts.l/2),
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
				h: NumberRange.GetRandInt(city.build_max_h/5, city.build_max_h/3)
			})));
		}
		if(chance(25) && opts.tall){
			var top = getBoxMeshOpts(_.assign(rim_opts, {
				w: opts.w - (opts.w/3),
				l: opts.w - (opts.w/3),
				x: opts.x,
				z: opts.z,
				h: NumberRange.GetRandInt(15, 30)
			}));
			top.castShadow = false;
			this.parts.Add(top);
		}
		//merged mesh
		var merged = meshgen.mergeMeshes(this.parts.ToArray());
		this.group = merged;
	}
};