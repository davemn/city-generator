#pragma strict

import System.Collections.Generic;

public class Car extends MonoBehaviour {
	private var speed: float;
	private var color: int;
	private var arrived_threshold: int = 2;
	private var collide_threshold: int = 2;
	private var dir: float;
	private var lane_offset: float;
	private var axis: float;
	private var dx: float = 0.0f;
	private var dz: float = 0.0f;

	// public function Car(x: float, z: float)
	function Start () {
		/* - begin port - */
		this.speed = Random.value * (CityGenerator.City.car_speed_min - CityGenerator.City.car_speed_max) + CityGenerator.City.car_speed_min;
		this.color = CityGenerator.Color.CARS[CityGenerator.Random.GetRandInt(0, CityGenerator.Color.CARS.Length)];

		// Use a Unity prefab instead of generating the mesh - the only dynamic part remaining is 
		// setting the mesh color.

		var rend: MeshRenderer = GetComponent.<MeshRenderer>();
		var mat: Material = rend.material;

		var r: int = (this.color >> 16) & 0xFF;
		var g: int = (this.color >> 8) & 0xFF;
		var b: int = this.color & 0xFF;
		mat.color = new Color(r / 255.0, g / 255.0, b / 255.0, 1.0);
		
		this.dir = CityGenerator.Random.RandDir();
		this.lane_offset = this.dir * CityGenerator.City.road_w/4;
		
		this.axis = Mathf.Round(Random.value);

		var x = transform.position.x;
		var z = transform.position.z;

		if(this.axis > 0.0f) {
			transform.localEulerAngles.y = 90.0f;
			z = z - this.lane_offset;
			x = -(this.dir * (CityGenerator.City.width/2));
		}
		else {
			x = x - this.lane_offset;
			z = -(this.dir * (CityGenerator.City.width/2));
		}
		
		transform.position = Vector3(x, 3, z);
	}

	function Update () {
		this.CheckCollision();
		if(this.axis > 0.0f){
			transform.Translate(this.dir * this.speed * Time.deltaTime, 0.0f, 0.0f, Space.World);
		}
		else{
			transform.Translate(0.0f, 0.0f, this.dir * this.speed * Time.deltaTime, Space.World);
		}
	}

	public function Arrived(): boolean {
		/*
		var out = CityGenerator.City.OutsideCity(transform.position.x, transform.position.z);
		return out ||
			((transform.localPosition.x < (dx + this.arrived_threshold)) &&
			(transform.localPosition.x > (dx - this.arrived_threshold)) &&
			(transform.localPosition.z < (dz + this.arrived_threshold)) &&
			(transform.localPosition.z > (dz - this.arrived_threshold)));
		*/
		return false;
	}

	public function CheckCollision() {
		// TODO not implemented in original source!
	}
}

