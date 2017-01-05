using System.Collections;
using System.Linq;

namespace CityGenerator {
	public static class Lodash {
		// Fisher-Yates shuffle (same alg. as Lodash)
		// Mutates the input List
		public static void Shuffle(IList<T> lst) {
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

		// private delegate T MapIteratee<S,T>(S value, int index, IList<S> collection);
		// public static IList<T> Map<S,T>(IList<S> collection, MapIteratee<> iteratee) {

		public static IList<T> Map<S,T>(IList<S> collection, Func<S,T> iteratee) {
			return Enumerable.Select<S,T> (collection, iteratee);
		}

		// TODO _.reject
	}
}