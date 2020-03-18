import { createEntropy, Random, MersenneTwister19937 } from "random-js";
import { Conferences, Teams, Descriptions } from "./basedata"
const gaussian = require("gaussian")
const R = require('ramda')
const Graph = require('graphlib').Graph

let gameOrder = [
    [
     
    ],
    //64
    [
        "M1A",
        "M1B",
        "M1C",
        "M1D",
        "M1E",
        "M1F",
        "M1G",
        "M1H",
        "W1A",
        "W1B",
        "W1C",
        "W1D",
        "W1E",
        "W1F",
        "W1G",
        "W1H",
        "S1A",
        "S1B",
        "S1C",
        "S1D",
        "S1E",
        "S1F",
        "S1G",
        "S1H",
        "E1A",
        "E1B",
        "E1C",
        "E1D",
        "E1E",
        "E1F",
        "E1G",
        "E1H",
    ],
    //32
    [
        "M2A",
        "M2B",
        "M2C",
        "M2D",
        "W2A",
        "W2B",
        "W2C",
        "W2D",
        "S2A",
        "S2B",
        "S2C",
        "S2D",
        "E2A",
        "E2B",
        "E2C",
        "E2D",        
    ],
    //16
    [
        "M3A",
        "M3B",
        "W3A",
        "W3B",
        "S3A",
        "S3B",
        "E3A",
        "E3B",        
    ],
    //8
    [
        "M4A",
        "W4A",
        "S4A",
        "E4A",
    ],
    //4
    [
        "F5A",
        "F5B"
    ],
    //2
    [
        "F6A"
    ]
]

const seedMap = {
    1: ["A", 0],
    16: ["A", 1],
    8: ["B", 0],
    9: ["B", 1],
    5: ["C", 0],
    12: ["C", 1],
    4: ["D", 0],
    13: ["D", 1],
    6: ["E", 0],
    11: ["E", 1],
    3: ["F", 0],
    14: ["F", 1],
    7: ["G", 0],
    10: ["G", 1],
    2: ["H", 0],
    15: ["H", 1],
}

const Model = {
    bracket: {},
    seed: "",
    description: "",
    champ: {},
    playIns: []
    //engine:
}

// new seed
// fill out field
// play out bracket

const newSeed = ()=>{
    const position = Math.round(Math.random()*2)
    return Math.abs(createEntropy()[position])
}







function Generate (seed=newSeed()) {
    Model.bracket = {}
    Model.descriptions = []
    Model.champ={}
    Model.seed = seed
    gameOrder[0] = []
    const random = new Random(MersenneTwister19937.seed(seed))

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

    const baseTeamRtg = (Off, Def)=>{
        return (Off + Def) / 2
    }
    
    const gameTempo = (TempoA,TempoB) => {
        const baseTempo = (TempoA + TempoB)/2
        const teamDistribution = gaussian(baseTempo, Math.pow(2.9,2))
        const rand = random.real(0,1,true) 
        const tmp = Math.round(teamDistribution.ppf(rand))
        return tmp / 100
    }

const gameTeamRtg = (teamRtg, stdDev, chaos=1)=>{
    const teamDistribution = gaussian(teamRtg, Math.pow((stdDev*chaos),2))
    const rand = random.real(0,1,true) 
    const rtg = Math.round(teamDistribution.ppf(rand))
    return rtg
}

const gameScore = (sampleA, sampleB) =>{

    const stdDev = 7
    // calculate rating for team A
    const baseA = baseTeamRtg(sampleA["O"], sampleB["D"])

    // calculate rating for team B
    const baseB = baseTeamRtg(sampleB["O"], sampleA["D"])

    // calculate tempo
    const tempo = gameTempo(sampleA["T"], sampleB["T"])

    // get regulation score for team A
    const regScoreA = Math.round(gameTeamRtg(baseA, stdDev, 1) * tempo)
    
    // get regulation score for team B
    const regScoreB = Math.round(gameTeamRtg(baseB, stdDev, 1) * tempo)

     // overtime loop
    let scoreA = regScoreA
    let scoreB = regScoreB
    let overtimes = 0
    while (scoreA == scoreB){
        const otscoreA = Math.round(gameTeamRtg(baseA, stdDev, 4) * tempo/8)
        const otscoreB = Math.round(gameTeamRtg(baseB, stdDev, 4) * tempo/8)
        overtimes += 1
        scoreA += otscoreA;
        scoreB += otscoreB;
    }

    return [scoreA, scoreB, overtimes]
   
}
    const bracket = new Graph();
    bracket.setDefaultEdgeLabel([])
    bracket.setDefaultNodeLabel({0: {}, 1:{}, score: []})
    gameOrder.map(function(set){
        set.map(function(node){
            bracket.setNode(node)
        })
    })

    gameOrder.map(function(set,setIndex){
        if(setIndex!=0 && setIndex!=6){
            set.map(function(node,nodeIndex){
                const targetNode = gameOrder[setIndex+1][Math.floor(nodeIndex/2)]
                const position = nodeIndex % 2 === 1 ? 1 : 0
                bracket.setEdge(node, targetNode, {position:position})
            })
        }
    })

    const emptyField = []

    //fill out field
    //get auto-bids
    const groupedByConference = R.groupBy((team)=>{
        return team["Conference"]
    })(R.values(Teams))
    
    const getAutoBidWeight = (team)=>{
        return [team, team["Auto-Bid"]]
    }

    const autobidBase = Conferences.map((conference)=>{
        const teams = groupedByConference[conference]
        const weights = R.values(teams).map((team)=>{
            return getAutoBidWeight(team)
        })
        const champ = random.weighted(weights)
        return champ

    })

    const autoBidBonus = (team)=>{
        const bonus = random.real(0,0.5,true)
        const lineProp = R.lensProp("Average seed line")
        return R.set(lineProp, team["Average seed line"]-bonus, team)
    }
    const autobids = autobidBase.map(autoBidBonus)
    const fieldWithAutobids = autobids
    
    const groupByChance = R.groupBy((team)=>{
        return team["At-large chance"]
    })(R.values(Teams))

    const locks = groupByChance["Lock"]
    const likely = groupByChance["Likely"]
    const work = groupByChance["Work"]
    

    const fieldWithLocksAndAutobids = R.unionWith(R.eqBy(R.prop('Team')),fieldWithAutobids, locks)
   
    let finalField = fieldWithLocksAndAutobids
    const concatLikelies = R.concat(likely, likely)
    const concatLikeWork = R.concat(likely, work)
    let bubble = R.concat(concatLikeWork,concatLikelies)
    
    const bubbleFuzz = (team)=>{
        const bonus = random.real(-0.25,0.25,true)
        const lineProp = R.lensProp("Average seed line")
        return R.set(lineProp, team["Average seed line"]-bonus, team)
    }
    
    while (R.length(finalField) < 68){
        const basePicked = random.pick(bubble)
        const picked = [bubbleFuzz(basePicked)]
        finalField = R.unionWith(R.eqBy(R.prop('Team')),finalField, picked)
        const remove = (team)=>{return R.propEq("Team", team)}
        bubble = R.reject(remove(picked[0]["Team"]), bubble)

    }
    
    


    const sortedFinalField = R.sortBy(R.prop("Average seed line"), finalField)
    // get first round teams
    
    const sortedAutobids = R.sortBy(R.prop("Average seed line"), autobids)
    const firstFourAuto = R.takeLast(4, sortedAutobids)

    const atLargeBids = R.difference(finalField, autobids)
    const sortedAtlargeBids = R.sortBy(R.prop("Average seed line"), atLargeBids)
    const firstFourAtLarge = R.takeLast(4, sortedAtlargeBids)
    const firstFourRawSeeds = firstFourAtLarge.map((team)=>{
        return (R.indexOf(team, sortedFinalField)+1)/4
    })

    const firstFourAdjustedSeeds = [Math.floor(R.mean(R.take(2,firstFourRawSeeds))), Math.floor(R.mean(R.takeLast(2,firstFourRawSeeds)))]
    let seeds = [
        [null, null, null, null],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
    ]

    seeds[16].push(R.take(2, firstFourAuto))
    seeds[16].push(R.takeLast(2, firstFourAuto))
    seeds[firstFourAdjustedSeeds[0]].push(R.take(2, firstFourAtLarge))
    seeds[firstFourAdjustedSeeds[1]].push(R.takeLast(2, firstFourAtLarge))
    
    const fieldWithoutFirstFour = R.difference(sortedFinalField, R.unionWith(R.eqBy(R.prop('Team')),firstFourAuto, firstFourAtLarge))
   
    fieldWithoutFirstFour.map((team)=>{
        let placed = false
        let i = 1
        while(placed==false){
            if(R.length(seeds[i])<4){
                seeds[i].push(team)
                placed = true
            } else {
                i++;
            }
        }
    })
   


const populate = (region, baseTeam, seed)=>{
    const seedLens = R.lensProp("Seed")
    const team = R.set(seedLens, seed, baseTeam)

    const nodeLabel = `${region}1${seedMap[seed][0]}`
    const node = bracket.node(nodeLabel)
    const lensview = R.lensProp(seedMap[seed][1])
    const newNode = R.set(lensview, team, node)
    bracket.setNode(nodeLabel, newNode)
}

const populatePlayIn = (region, baseTeams, seed)=>{
    console.log(baseTeams)
    const seedLens = R.lensProp("Seed")
    const teams = baseTeams.map((team)=>{
        return R.set(seedLens,seed, team)
    })
    console.log(teams)
    const label = `P${region}0${seed}`
    gameOrder[0].push(label)
    bracket.setNode(label, {0: teams[0], 1:teams[1], score: []})
    const targetNode = `${region}1${seedMap[seed][0]}`
    bracket.setEdge(label, targetNode, {position: seedMap[seed][1]})
}

seeds.map((seedgroup, seedline)=>{
    if(seedline!=0){
        const regions = random.shuffle(['M', 'E', 'S', 'W'])
        seedgroup.map((item, index)=>{
            if(R.is(Array,item)===false){
                console.log(item["Team"],regions[index], seedline)
                populate(regions[index],item,seedline)
            } else {
                populatePlayIn(regions[index], item, seedline)
            }
        })
    }
})

 


    const getNextMatchup = (node)=>{
        const position = bracket.edge(bracket.outEdges(node)[0])["position"]
        const nextSlot = bracket.successors(node)[0]
        return {nextSlot: nextSlot, position: position}
    }
    
    
    const advance = (position, node)=>{
        const team = bracket.node(node)[position]
        const nextMatchup = getNextMatchup(node)
        const label = bracket.node(nextMatchup.nextSlot)
        const lensview = R.lensProp(nextMatchup.position)
        const newNode = R.set(lensview, team, label)
        bracket.setNode(nextMatchup.nextSlot, newNode)
       // console.log(bracket.node(nextMatchup.nextSlot))
    }

    gameOrder.map((round, index)=>{
        round.map((game)=>{
            let gameInfo = bracket.node(game)
            const results = gameScore(gameInfo["0"], gameInfo["1"])
            gameInfo.score = results
            bracket.setNode(game, gameInfo)
            if (index<6){
                if(results[0]>results[1]){
                    advance(0, game)
                } else{
                    advance(1, game)
                }
            }
            else{
                Model.champ = results[0] > results[1] ? gameInfo["0"] : gameInfo["1"]
            }
        })
    })

    Model.bracket = bracket
    Model.description = random.pick(Descriptions)
    Model.playIns = gameOrder[0]
    return bracket
}


export {Model, Generate, newSeed}





//console.log(bracket.successors('W2B'))

