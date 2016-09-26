using UnityEngine;
using System.Collections;

public class CityConfig {
	//height of bedrock layer
	public float baze = 40;
	//depth of the water and earth layers
	public float water_height = 20;
	//block size (w&l)
	public float block = 100; 
	//num blocks x
	public float blocks_x = 16;
	//num blocks z
	public float blocks_z = 16;
	//road width
	public float road_w = 16;
	//curb height
	public float curb_h = 2;
	//block slices
	public float subdiv = 2; 
	//sidewalk width
	public float inner_block_margin = 5;
	//max building height
	public float build_max_h = 300;
	//min building height
	public float build_min_h = 20;
	//deviation for height within block
	public float block_h_dev = 10;
	//exponent of height increase 
	public float build_exp = 6;
	//chance of blocks being water
	public float water_threshold = 0.1f; 
	//chance of block containg trees
	public float tree_threshold = 0.2f;
	//max trees per block
	public float tree_max = 20;
	//max bridges
	public float bridge_max = 1;
	//beight heaight
	public float bridge_h = 25;
	//max cars at one time
	public float car_max = 10;
	//train max
	public float train_max = 1;
	//maximum car speed
	public float car_speed_min = 2;
	//minimum car speed
	public float car_speed_max = 3;
	//train speed
	public float train_speed = 4;
	//noise factor; increase for smoother noise
	public float noise_frequency = 8;
	//seed for generating noise
	public float seed {
		get { 
			float r = 1.0f; 
			while (r == 1.0f) { // to match JS' Math.random() [0,1) behaviour
				r = Random.value;
			}
			return r;
		}
	}

	public float width { get { return this.block * this.blocks_x; } }
	public float length { get { return this.block * this.blocks_z; } }
}