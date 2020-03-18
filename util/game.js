const { Random, MersenneTwister19937, createEntropy } = require("random-js");
const gaussian = require('gaussian')

//get a seed (export elsewhere)
/*const seedArray = [ -699304574,
    -4112041,
    -1805862107,
    -53155153,
    1559167461,
    1719463952,
    -369100359,
    1829066159,
    -721142637,
    -1262066529,
    -648357903,
    355943521,
    2105886592,
    334549200,
    799533137,
    914576345 
]
const random = new Random(MersenneTwister19937.seedWithArray(seedArray));*/
const random = new Random(MersenneTwister19937.autoSeed());



const universe = {
    mean: 103,
    stdDev: 6.1
}

const teamA = {
    oRtg: 110.2,
    dRtg: 98.1,
    tempo: 55.8
}

const teamB = {
    oRtg: 101.7,
    dRtg: 109.1,
    tempo: 68.8
}

const teamA = {
    oRtg: 110.2,
    dRtg: 98.1,
    tempo: 55.8
}

const teamB = {
    oRtg: 101.7,
    dRtg: 109.1,
    tempo: 68.8
}
const baseTeamRtg = (Off, Def)=>{
    return (Off + Def) / 2
}

const gameTempo = (TempoA,TempoB) => {
    return (TempoA + TempoB) / 200
}

const gameTeamRtg = (teamRtg, stdDev, chaos=1)=>{
    const teamDistribution = gaussian(teamRtg, Math.pow((stdDev*chaos),2))
    const rand = random.real(0,1,true) 
    const rtg = Math.round(teamDistribution.ppf(rand))
    return rtg
}

const gameScore = (sampleA, sampleB, uni) =>{
    // calculate rating for team A
    const baseA = baseTeamRtg(sampleA.oRtg, sampleB.dRtg)

    // calculate rating for team B
    const baseB = baseTeamRtg(sampleB.oRtg, sampleA.dRtg)

    // calculate tempo
    const tempo = gameTempo(sampleA.tempo, sampleB.tempo)

    // get regulation score for team A
    const regScoreA = Math.round(gameTeamRtg(baseA, uni.stdDev, 1) * tempo)
    
    // get regulation score for team B
    const regScoreB = Math.round(gameTeamRtg(baseB, uni.stdDev, 1) * tempo)

     // overtime loop
    let scoreA = regScoreA
    let scoreB = regScoreB
    let overtimes = 0
    while (scoreA == scoreB){
        const otscoreA = Math.round(gameTeamRtg(baseA, uni.stdDev, 4) * tempo/8)
        const otscoreB = Math.round(gameTeamRtg(baseB, uni.stdDev, 4) * tempo/8)
        overtimes += 1
        scoreA += otscoreA;
        scoreB += otscoreB;
    }

    return [scoreA, scoreB, overtimes]
   
}

let AWin = 0
let BWin = 0
let overtimes = 0
let i = 0
for (let i = 0; i<100; i++){
    const result = gameScore(teamA, teamB, universe)
    if (result[0] > result[1]){
        AWin++;
    } else {
        BWin++;
    }
    if(result[2]>0){
        overtimes++
    }
}

console.log([AWin, BWin, overtimes])

