#pragma strict

import System.Collections.Generic;

public class Car extends MonoBehaviour {
	public var mesh: GameObject;
	public var meshgen: MeshGenerator;

	private var city: CityConfig;
	private var speed: float;
	private var color: int;
	private var arrived_threshold: int;
	private var collide_threshold: int;
	private var dir: float;
	private var lane_offset: float;
	private var axis: float;

	function Start () {

	}

	function Update () {

	}

	// new Car(rand_x, rand_z);
	public function Car(x: float, z: float, dx, dz) {
		this.city = new CityConfig();

		/* - begin port - */
		this.speed = Random.value * (city.car_speed_min - city.car_speed_max) + city.car_speed_min;
		this.color = CityGenerator.Color.CARS[CityGenerator.Random.GetRandInt(0, CityGenerator.Color.CARS.Length)];
		this.mesh = meshgen.getBoxMesh(this.color, 4, 3, 9, x, 3, z, false);
		this.mesh.transform.parent = transform;

		this.arrived_threshold = 2;
		this.collide_threshold = 2;
		
		this.dir = CityGenerator.Random.RandDir();
		this.lane_offset = this.dir * city.road_w/4;
		
		this.axis = Mathf.Round(Random.value);
		
		if(this.axis > 0.0f){
			this.mesh.transform.localEulerAngles.y = Mathf.Rad2Deg * Mathf.PI/2;
			z = z - this.lane_offset;
			x = -(this.dir * (city.width/2));
		}
		else{
			x = x - this.lane_offset;
			z = -(this.dir * (city.width/2));
		}
		
		this.mesh.transform.localPosition = Vector3(x, 3, z);
	}

	public function Drive(deltaTime: float) {
		this.checkCollision();
		if(this.axis){
			this.mesh.transform.Translate(this.dir * this.speed * deltaTime, 0.0f, 0.0f);
		}
		else{
			this.mesh.transform.Translate(0.0f, 0.0f, this.dir * this.speed * deltaTime);
		}
	}

	public function Arrived(): boolean {
		var out = outsideCity(this.mesh.position.x, this.mesh.position.z);
		return out ||
			((this.mesh.position.x < (dx + this.arrived_threshold)) &&
			(this.mesh.position.x > (dx - this.arrived_threshold)) &&
			(this.mesh.position.z < (dz + this.arrived_threshold)) &&
			(this.mesh.position.z > (dz - this.arrived_threshold)));
	}

	public function CheckCollision() {
		// TODO not implemented in original source!
	}
}

