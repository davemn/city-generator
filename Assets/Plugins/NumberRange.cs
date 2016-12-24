using UnityEngine;
using System.Collections;

public class NumberRange {
	//map val (0-1) to a range with optional weight (default 1.0)
	public static float MapToRange(float val, float min, float max){
		return NumberRange.MapToRange(val, min, max, 1.0f);
	}

	//map val (0-1) to a range with optional weight (default 1.0)
	public static float MapToRange(float val, float min, float max, float exp){
		var weighted = Mathf.Pow(val, exp);
		//make the highest little higher
		if (val >= 0.9f) 
			weighted = val;
		var num = Mathf.Floor(weighted * (max - min)) + min;
		return num;
	}

	//get a random int in range
	public static float GetRandInt(int min, int max) {
		return NumberRange.MapToRange(Random.value, (float) min, (float) max);
	}
	
	public static float GetRandInt(int min, int max, float exp) {
		return NumberRange.MapToRange(Random.value, (float) min, (float) max, exp);
	}
}
