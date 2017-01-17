#pragma strict

import System.Collections.Generic;

public class Car extends MonoBehaviour {
	public var mesh: GameObject;
	public var meshgen: MeshGenerator;

	private var speed: float;
	private var color: int;
	private var arrived_threshold: int;
	private var collide_threshold: int;
	private var dir: float;
	private var lane_offset: float;
	private var axis: float;
	private var dx: float = 0.0f;
	private var dz: float = 0.0f;

	function Start () {

	}

	function Update () {

	}

	// new Car(rand_x, rand_z);
	public function Car(x: float, z: float) {
		/* - begin port - */
		this.speed = Random.value * (CityGenerator.City.car_speed_min - CityGenerator.City.car_speed_max) + CityGenerator.City.car_speed_min;
		this.color = CityGenerator.Color.CARS[CityGenerator.Random.GetRandInt(0, CityGenerator.Color.CARS.Length)];
		this.mesh = meshgen.getBoxMesh(this.color, 4, 3, 9, x, 3, z, false);
		this.mesh.transform.parent = transform;

		this.arrived_threshold = 2;
		this.collide_threshold = 2;
		
		this.dir = CityGenerator.Random.RandDir();
		this.lane_offset = this.dir * CityGenerator.City.road_w/4;
		
		this.axis = Mathf.Round(Random.value);
		
		if(this.axis > 0.0f){
			this.mesh.transform.localEulerAngles.y = Mathf.Rad2Deg * Mathf.PI/2;
			z = z - this.lane_offset;
			x = -(this.dir * (CityGenerator.City.width/2));
		}
		else{
			x = x - this.lane_offset;
			z = -(this.dir * (CityGenerator.City.width/2));
		}
		
		this.mesh.transform.localPosition = Vector3(x, 3, z);
	}

	public function Drive(deltaTime: float) {
		this.CheckCollision();
		if(this.axis){
			this.mesh.transform.Translate(this.dir * this.speed * deltaTime, 0.0f, 0.0f);
		}
		else{
			this.mesh.transform.Translate(0.0f, 0.0f, this.dir * this.speed * deltaTime);
		}
	}

	public function Arrived(): boolean {
		var out = CityGenerator.City.OutsideCity(this.mesh.transform.position.x, this.mesh.transform.position.z);
		return out ||
			((this.mesh.transform.position.x < (dx + this.arrived_threshold)) &&
			(this.mesh.transform.position.x > (dx - this.arrived_threshold)) &&
			(this.mesh.transform.position.z < (dz + this.arrived_threshold)) &&
			(this.mesh.transform.position.z > (dz - this.arrived_threshold)));
	}

	public function CheckCollision() {
		// TODO not implemented in original source!
	}
}

