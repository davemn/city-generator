using UnityEngine;
using System.Collections;

public interface IMeshGenerator {
	GameObject getBoxMesh (int c, float w, float h, float l);
	GameObject getBoxMesh (int c, float w, float h, float l, float x, float y, float z);
	GameObject getBoxMesh (int c, float w, float h, float l, float x, float y, float z, bool shadow);

	GameObject getWaterMesh (float w, float h, float l);
	GameObject getWaterMesh (float w, float h, float l, float x, float y, float z);

	// In Unity terms, would be more appropriately named 'mergeGameObjects'.
	// THREE.Mesh <=> UnityEngine.GameObject (with Mesh + Material)
	// THREE.Geometry <=> UnityEngine.Mesh
	GameObject mergeMeshes (GameObject[] meshes);
	GameObject mergeMeshes (GameObject[] meshes, bool shadows);
	GameObject mergeMeshes (GameObject[] meshes, bool shadows, Material material);
}
