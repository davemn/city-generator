#pragma strict

private var city: CityConfig;
private var cars: List.<Car>;
private var locked: boolean;
private var max_add_rate: int;

private var unlockAt: float;

function Start () {
	this.city = new CityConfig();
	this.cars = new List.<Car>();
	this.locked = false;
	this.max_add_rate = 300;
}

function Add () {
	this.locked = true;
	//get random x and z on a road
	var rand_x = city.block * CityGenerator.Random.GetRandInt((-city.blocks_x/2+1), city.blocks_x/2);
	var rand_z = city.block * CityGenerator.Random.GetRandInt((-city.blocks_z/2+1), city.blocks_z/2);
	var car = new Car(rand_x, rand_z);
	this.cars.Add(car);
	car.mesh.transform.parent = transform;

	// setTimeout(function(){ this.locked = false; }, this.max_add_rate);
	this.unlockAt = Time.time + this.max_add_rate;
}

function Update () {
	if(this.locked && Time.time > unlockAt) {
		this.locked = false;
	}

	//add cars
	if((this.cars.Count < city.car_max) && !this.locked) {
		this.Add();
	}

	for(var car: Car in this.cars) {
		//remove from car array
		if(car.Arrived()){
			CityGenerator.Lodash.Pull(this.cars, car);
			Destroy (car.mesh);
		}
		//update car positions
		else{
			car.Drive();
		}
	};
}