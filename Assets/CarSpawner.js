#pragma strict

var carPrefab: Transform;

private var city: CityConfig;
private var cars: List.<Transform>;
private var locked: boolean;
private var max_add_rate: int;

private var unlockAt: float = 0.0f;

function Start () {
	this.city = new CityConfig();
	this.cars = new List.<Transform>();
	this.locked = false;
	this.max_add_rate = 0.3f;
}

function Add () {
	this.locked = true;
	//get random x and z on a road
	var rand_x = city.block * CityGenerator.Random.GetRandInt((-city.blocks_x/2+1), city.blocks_x/2);
	var rand_z = city.block * CityGenerator.Random.GetRandInt((-city.blocks_z/2+1), city.blocks_z/2);

	var car: Transform  = Instantiate (carPrefab, new Vector3 (rand_x, 0.0f, rand_z), Quaternion.identity);
	car.parent = transform;

	this.cars.Add (car);

	// setTimeout(function(){ this.locked = false; }, this.max_add_rate);
	this.unlockAt = Time.time + this.max_add_rate;
}

function Update () {
	if(this.locked && (Time.time > this.unlockAt)) {
		this.locked = false;
	}

	//add cars
	if((this.cars.Count < city.car_max) && !this.locked) {
		this.Add();
	}

	for(var car: Transform in this.cars) {
		var carScript = car.GetComponent.<Car>();

		//remove from car array
		if(carScript.Arrived()){
			CityGenerator.Lodash.Pull(this.cars, car);
			Destroy (car.gameObject);
		}
	};
}