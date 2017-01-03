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

		// Fisher-Yates shuffle, ala Lodash
		// Mutates the input List
		public static void ShuffleList(IList<T> lst) {
			// Loops through array
			for (int i = lst.Count-1; i > 0; i--) {
				// Randomize a number between 0 and i (so that the range decreases each time)
				int rnd = UnityEngine.Random.Range(0,i+1); // +1 since Range() for ints is [,)

				// Swap the new and old values
				T temp = lst[i];
				lst[i] = lst[rnd];
				lst[rnd] = temp;
			}
		}
	}
}