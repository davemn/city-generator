#pragma strict

import System.Collections.Generic;

// not named Tree, to avoid conflict with UnityEngine.Tree
public class ParkTree
{
	public var group: GameObject;

	private var meshgen: MeshGenerator;
	private var parts: List.<GameObject>;

	public function ParkTree(x: float, z: float, meshgen: MeshGenerator) {
		this.meshgen = meshgen;
		this.parts = new List.<GameObject>();

		var h = CityGenerator.Random.GetRandInt(2, 4);
		var trunk = meshgen.getBoxMesh(CityGenerator.Color.LIGHT_BROWN, 2, h, 2, x, h/2+City.curb_h, z);
		var leaves = meshgen.getCylinderMesh(CityGenerator.Color.TREE, 5, 10, 0,  x, h+5+City.curb_h, z);
		var leaves2 = meshgen.getCylinderMesh(CityGenerator.Color.TREE, 5, 10, 0,  x, leaves.transform.position.y+5, z);
		// leaves.transform.rotation.y = Mathf.Random;
		leaves.transform.Rotate(new Vector3(0,Random.Range(0.0f,360.0f),0));

		this.parts.Add(leaves);
		this.parts.Add(leaves2);
		this.parts.Add(trunk);

		this.group = meshgen.mergeMeshes(this.parts.ToArray());
	}
}