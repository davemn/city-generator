using UnityEngine;
using System.Collections;

public class CityConfig {
	//height of bedrock layer
	public float baze { get { return 40; } }
	//depth of the water and earth layers
	public float water_height { get { return 20; } }
	//block size (w&l)
	public float block { get { return 100; } }
	//num blocks x
	public float blocks_x { get { return 16; } }
	//num blocks z
	public float blocks_z { get { return 16; } }
	//road width
	public float road_w { get { return 16; } }
	//curb height
	public float curb_h { get { return 2; } }
	//block slices
	public float subdiv { get { return 2; } }
	//sidewalk width
	public float inner_block_margin { get { return 5; } }
	//max building height
	public float build_max_h { get { return 300; } }
	//min building height
	public float build_min_h { get { return 20; } }
	//deviation for height within block
	public float block_h_dev { get { return 10; } }
	//exponent of height increase 
	public float build_exp { get { return 6; } }
	//chance of blocks being water
	public float water_threshold { get { return 0.1f; } }
	//chance of block containg trees
	public float tree_threshold { get { return 0.2f; } }
	//max trees per block
	public float tree_max { get { return 20; } }
	//max bridges
	public float bridge_max { get { return 1; } }
	//beight heaight
	public float bridge_h { get { return 25; } }
	//max cars at one time
	public float car_max { get { return 10; } }
	//train max
	public float train_max { get { return 1; } }
	//maximum car speed
	public float car_speed_min { get { return  2; } }
	//minimum car speed
	public float car_speed_max { get { return 3; } }
	//train speed
	public float train_speed { get { return 4; } }
	//noise factor; increase for smoother noise
	public float noise_frequency { get { return 8; } }
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