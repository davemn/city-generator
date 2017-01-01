#pragma strict

public class MeshGenerator extends MonoBehaviour
{
	public var boxPrefab: Transform;
	public var waterPrefab: Transform;
	public var cylinderPrefab: Transform;
	public var mergePrefab: Transform;

	/* returns GameObject */
	public function getBoxMesh (c: int, w: float, h: float, l: float)
	{
		return this.getBoxMesh (c, w, h, l, 0.0, 0.0, 0.0, true);
	}

	public function getBoxMesh (c: int, w: float, h: float, l: float, x: float, y: float, z: float)
	{
		return this.getBoxMesh (c, w, h, l, x, y, z, true);
	}

	public function getBoxMesh (c: int, w: float, h: float, l: float, x: float, y: float, z: float, shadow: boolean)
	{
		var box: Transform = Instantiate (boxPrefab, new Vector3 (x,y,z), Quaternion.identity);
		box.localScale = new Vector3(w,h,l);

		var boxRend: MeshRenderer = box.GetComponent.<MeshRenderer>();
		var boxMat: Material = boxRend.material;

		var r: int = (c >> 16) & 0xFF;
		var g: int = (c >> 8) & 0xFF;
		var b: int = c & 0xFF;
		boxMat.color = new Color(r / 255.0, g / 255.0, b / 255.0, 1.0);

		boxRend.receiveShadows = shadow;
		if(shadow)
			boxRend.shadowCastingMode = Rendering.ShadowCastingMode.On;
		else
			boxRend.shadowCastingMode = Rendering.ShadowCastingMode.Off;

		return box.gameObject;
	}

	public function getWaterMesh (w: float, h: float, l: float)
	{
		return this.getWaterMesh (w, h, l, 0.0, 0.0, 0.0);
	}

	public function getWaterMesh (w: float, h: float, l: float, x: float, y: float, z: float)
	{
		return this.getBoxMesh(CityGenerator.Color.WATER, w, h, l, x, y, z, false);
	}

	//create a cylinder mesh with a geometry and material
	public function getCylinderMesh(c: int, rb: float, h: float, rt: float, x: float, y: float, z: float) {
		var cyl: Transform = Instantiate (cylinderPrefab, new Vector3 (x,y,z), Quaternion.identity);
		// TODO support diff radius for top & bottom, ala THREE.CylinderGeometry

		// default cylinder mesh is 2 units tall, is scaled in prefab to make a unit cylinder
		// as a result, set scale relative to prefab, instead of absolute
		cyl.localScale = Vector3.Scale(cyl.localScale, new Vector3(rb,h,rb));

		var cylRend: MeshRenderer = cyl.GetComponent.<MeshRenderer>();
		var cylMat: Material = cylRend.material;

		var r: int = (c >> 16) & 0xFF;
		var g: int = (c >> 8) & 0xFF;
		var b: int = c & 0xFF;
		cylMat.color = new Color(r / 255.0, g / 255.0, b / 255.0, 1.0);

		cylRend.receiveShadows = true;
		cylRend.shadowCastingMode = Rendering.ShadowCastingMode.On;

		return cyl.gameObject;
	}

	// In Unity terms, would be more appropriately named 'mergeGameObjects'.
	// THREE.Mesh <=> UnityEngine.GameObject (with Mesh + Material)
	// THREE.Geometry <=> UnityEngine.Mesh

	public function mergeMeshes (meshes: GameObject[])
	{
		return this.mergeMeshes (meshes, true);
	}

	public function mergeMeshes (meshes: GameObject[], shadows: boolean)
	{
		var rend: MeshRenderer = meshes[0].GetComponent.<MeshRenderer>();
		return this.mergeMeshes (meshes, shadows, rend.material);
	}

	public function mergeMeshes_Manual (meshes: GameObject[], shadows: boolean, material: Material)
	{
		var combineArgs: CombineInstance[] = new CombineInstance[meshes.Length];

		var curGO: GameObject;
		var curFilter: MeshFilter;

		for(var i: int = 0; i < meshes.Length; i++) {
			curGO = meshes[i];
			curFilter = curGO.GetComponent.<MeshFilter>();

			combineArgs[i].mesh = curFilter.sharedMesh;
			combineArgs[i].transform = curFilter.transform.localToWorldMatrix;
			curGO.SetActive (false);
			Destroy (curGO);
		}

		var combined: GameObject = new GameObject();
		combined.transform.position = Vector3.zero;

		var combinedFilter: MeshFilter = combined.AddComponent.<MeshFilter>() as MeshFilter;
		combinedFilter.mesh = new Mesh();
		combinedFilter.mesh.CombineMeshes (combineArgs);

		var combinedRend: MeshRenderer = combined.AddComponent.<MeshRenderer>() as MeshRenderer;
		combinedRend.material = material;

		combinedRend.receiveShadows = shadows;
		if(shadows)
			combinedRend.shadowCastingMode = Rendering.ShadowCastingMode.On;
		else
			combinedRend.shadowCastingMode = Rendering.ShadowCastingMode.Off;

		// combined.SetActive (true);
		return combined;
	}

	public function mergeMeshes (meshes: GameObject[], shadows: boolean, material: Material)
	{
		var combineArgs: CombineInstance[] = new CombineInstance[meshes.Length];

		var curGO: GameObject;
		var curFilter: MeshFilter;
		var curRend: MeshRenderer;
		var calcBounds: Bounds;

		for(var i: int = 0; i < meshes.Length; i++) {
			curGO = meshes[i];
			curFilter = curGO.GetComponent.<MeshFilter>();
			curRend = curGO.GetComponent.<MeshRenderer>();

			combineArgs[i].mesh = curFilter.sharedMesh;
			combineArgs[i].transform = curFilter.transform.localToWorldMatrix;

			if (calcBounds == null)
				calcBounds = new Bounds(curRend.bounds.center, curRend.bounds.size);
			else {
				calcBounds.Encapsulate (curRend.bounds.min);
				calcBounds.Encapsulate (curRend.bounds.max);
			}

			Destroy (curGO);
		}

		var combined: GameObject = Instantiate (mergePrefab, Vector3.zero, Quaternion.identity).gameObject;

		// Set mesh to the combined mesh
		var combinedFilter: MeshFilter = combined.GetComponent.<MeshFilter>();
		combinedFilter.mesh = new Mesh();
		combinedFilter.mesh.CombineMeshes (combineArgs);

		// Update the assigned material
		var combinedRend: MeshRenderer = combined.GetComponent.<MeshRenderer>();
		combinedRend.material = material;

		// Shadows on/off
		combinedRend.receiveShadows = shadows;
		if(shadows)
			combinedRend.shadowCastingMode = Rendering.ShadowCastingMode.On;
		else
			combinedRend.shadowCastingMode = Rendering.ShadowCastingMode.Off;

		// Collider to wrap around (now singular) mesh
		var combinedCollider: BoxCollider = combined.GetComponent.<BoxCollider>();
		// combinedCollider.bounds = calcBounds;
		combinedCollider.center = calcBounds.center;
		combinedCollider.size = calcBounds.size;

		return combined;
	}
}