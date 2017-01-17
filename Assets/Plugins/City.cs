using System.Collections;
using System.Collections.Generic;

namespace CityGenerator {
	public static class City
	{
		//height of bedrock layer
		public static float baze = 40;
		//depth of the water and earth layers
		public static float water_height = 20;
		//block size (w&l)
		public static float block = 100;
		//num blocks x
		public static float blocks_x = 16;
		//num blocks z
		public static float blocks_z = 16;
		//road width
		public static float road_w = 16;
		//curb height
		public static float curb_h = 2;
		//block slices
		public static float subdiv = 2;
		//sidewalk width
		public static float inner_block_margin = 5;
		//max building height
		public static float build_max_h = 300;
		//min building height
		public static float build_min_h = 20;
		//deviation for height within block
		public static float block_h_dev = 10;
		//exponent of height increase 
		public static float build_exp = 6;
		//chance of blocks being water
		public static float water_threshold = 0.1f;
		//chance of block containg trees
		public static float tree_threshold = 0.2f;
		//max trees per block
		public static float tree_max = 20;
		//max bridges
		public static float bridge_max = 1;
		//beight heaight
		public static float bridge_h = 25;
		//max cars at one time
		public static float car_max = 10;
		//train max
		public static float train_max = 1;
		//maximum car speed
		public static float car_speed_min =  2;
		//minimum car speed
		public static float car_speed_max = 3;
		//train speed
		public static float train_speed = 4;
		//noise factor; increase for smoother noise
		public static float noise_frequency = 8;
		//seed for generating noise
		public static float seed {
			get { 
				float r = 1.0f; 
				while (r == 1.0f) { // to match JS' Math.random() [0,1) behaviour
					r = UnityEngine.Random.value;
				}
				return r;
			}
		}

		public static float width = City.block * City.blocks_x;
		public static float length = City.block * City.blocks_z;

		/* ----------------------------------------------------------- */

		private static bool BlockHasTrees(float n) {
			return n <= City.tree_threshold;
		}

		private static List<float> GetHeightmapRow(List<float> heightmapGray, int width, int height, int row) {
			List<float> px = heightmapGray;
			return px.GetRange(row*width, width);
		}

		private static List<float> GetHeightmapColumn(List<float> heightmapGray, int width, int height, int column) {
			List<float> px = heightmapGray;
			List<float> columnList = new List<float>();
			for(int r=0; r < height; r++){
				columnList.Add(px[r*width + column]);
			}
			return columnList;
		}

		//is a point outside the city bounds
		public static bool OutsideCity (float x, float z) {
			return (UnityEngine.Mathf.Abs(x) > City.width/2) ||
				(UnityEngine.Mathf.Abs(z) > City.length/2);
		}

		//get x,z from index
		public static float GetCoordinateFromIndex(float index, float offset) {
			return (-(offset/2f) + (index * City.block)) + (City.block/2f);
		}

		//get rows or columns with no buildings
		public static List<CityGenerator.MapRow> GetEmptyRows(UnityEngine.Texture2D heightmap) {
			List<UnityEngine.Color> heightmapColor = new List<UnityEngine.Color>(heightmap.GetPixels());

			System.Func<UnityEngine.Color, float> colorToFloat = c => c.r;
			List<float> heightmapGray = CityGenerator.Lodash.Map(heightmapColor, colorToFloat);

			/* - begin ported code - */
			int i;
			List<CityGenerator.MapRow> empty = new List<CityGenerator.MapRow>();
			//loop through rows
			for(i=0; i<heightmap.height; i++){
				// list of float grayscale vals for the current row
				var row = GetHeightmapRow(heightmapGray, heightmap.width, heightmap.height, i);

				//all values in row are over tree threshold
				row = CityGenerator.Lodash.Reject(row, BlockHasTrees);

				if(row.Count == 0){
					CityGenerator.MapRow emptyRow;
					emptyRow.axis = 0;
					emptyRow.index = i;
					empty.Add(emptyRow);
				}
			}

			//loop through columns
			for(i=0; i<heightmap.width;i++){
				var col = GetHeightmapColumn(heightmapGray, heightmap.width, heightmap.height, i);

				col = CityGenerator.Lodash.Reject(col, BlockHasTrees);

				if(col.Count == 0){
					CityGenerator.MapRow emptyCol;
					emptyCol.axis = 1;
					emptyCol.index = i;
					empty.Add(emptyCol);
				}
			}
			return empty;
		}
	}
}