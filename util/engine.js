const Random = require("random-js");
const R = require("ramda")
//const {map, last, sum, reduceWhile} = R
/*import map from "ramda/src/map"
import last from "ramda/src/last"
import sum from "ramda/src/sum"
import reduceWhile from "ramda/src/reduceWhile"*/
const random = new Random(Random.engines.mt19937().autoSeed());

random.weighted = (probs) => {
    //values: [[value, weight]]
    const weights = R.map(R.last, probs)
    const sumweights = R.sum(weights)
    const seed = random.real(0, sumweights)
    const matches = (acc, x) => { return seed >= acc[1] }
    const iterate = (acc, value) => {return [value[0], (acc[2]+value[1]), (acc[2] + value[1])] }
        
    const taken = R.reduceWhile(matches, iterate, ["", 0, 0], probs);
    const result = taken[0];
    return result
}

export default random;
