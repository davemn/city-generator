using System.Collections.Generic;
using System.Linq;

namespace CityGenerator {
	public static class Lodash {
		// Fisher-Yates shuffle (same alg. as Lodash)
		// NB. Does not create a new list! Mutates and returns
		public static List<T> Shuffle<T>(List<T> lst) {
			// Loops through array
			for (int i = lst.Count-1; i > 0; i--) {
				// Randomize a number between 0 and i (so that the range decreases each time)
				int rnd = UnityEngine.Random.Range(0,i+1); // +1 since Range() for ints is [,)

				// Swap the new and old values
				T temp = lst[i];
				lst[i] = lst[rnd];
				lst[rnd] = temp;
			}
			return lst;
		}

		// private delegate T MapIteratee<S,T>(S value, int index, IList<S> collection);
		// public static IList<T> Map<S,T>(IList<S> collection, MapIteratee<> iteratee) {

		public static List<T> Map<S,T>(List<S> collection, System.Func<S,T> iteratee) {
			IEnumerable<T> res = collection.Select<S,T> (iteratee);

			// make Select() synchronous by forcing a single iteration,
			// and copying the result to a new List<>
			List<T> resList = new List<T> ();
			foreach (T elem in res) {
				resList.Add (elem);
			}
			return resList;
		}

		// _.reject
		public static List<T> Reject<T>(List<T> collection, System.Func<T,bool> predicate) {
			System.Func<T,bool> notPredicate = t => !predicate (t);
			IEnumerable<T> res = collection.Where (notPredicate);

			List<T> resList = new List<T> ();
			foreach (T elem in res) {
				resList.Add (elem);
			}
			return resList;
		}

		// _.pull
		// https://msdn.microsoft.com/en-us/library/w5zay9db.aspx
		public static List<T> Pull<T>(List<T> array, params T[] values) {
			// foreach(T val in values){
			for(int i = 0; i < values.Length; i++) {
				T val = values [i];
				while(array.Contains(val)){
					array.Remove (val);
				}
			}
			return array;
		}
	}
}