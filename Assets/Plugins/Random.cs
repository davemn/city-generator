using System.Collections;

namespace CityGenerator {
	public static class Random {
		//get a random int in range
		public static float GetRandInt(int min, int max) {
			return NumberRange.MapToRange(UnityEngine.Random.value, (float) min, (float) max);
		}
		
		public static float GetRandInt(int min, int max, float exp) {
			return NumberRange.MapToRange(UnityEngine.Random.value, (float) min, (float) max, exp);
		}

		//returns true percent of the time
		public static bool Chance(float percent) {
			return UnityEngine.Random.value < (percent/100.0f);
		}
		
		//return 1 or -1
		public static float RandDir() {
			return UnityEngine.Mathf.Round(UnityEngine.Random.value) * 2 - 1;
		}
	}
}