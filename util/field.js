const R = require("ramda")

const { Random, MersenneTwister19937, createEntropy } = require("random-js");
import {Conferences, Teams} from "./basedata"
//const {map, last, sum, reduceWhile} = R
/*import map from "ramda/src/map"
import last from "ramda/src/last"
import sum from "ramda/src/sum"
import reduceWhile from "ramda/src/reduceWhile"*/
const random = new Random(MersenneTwister19937.autoSeed());

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



const groupedByConference = R.groupBy((team)=>{
    return team["Conference"]
})(R.values(sampleTeams))

const getAutoBidWeight = (team)=>{
    return [team["Team"], team["Auto-Bid"]]
}


const autobids = Conferences.map((conference)=>{
    const teams = groupedByConference[conference]
    const weights = Teams.map((team)=>getAutoBidWeight(team))
  //  console.log(weights)
    const champ = random.weighted(weights)
  //  console.log(champ)
    return champ
})


const groupByChance = R.groupBy((team)=>{
    return team["At-large chance"]
})(R.values(sampleTeams))

const locks = groupByChance["Lock"]
const likely = groupByChance["Likely"]
const work = groupByChance["Work"]

//add autobids to field

