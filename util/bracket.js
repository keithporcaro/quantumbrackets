//Region-Round-Slot-A/B
//play-in is round 0
//Final Four is region F, but retains round numbers

const Graph = require('graphlib').Graph



const gameOrder = [
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

const bracket = new Graph();
bracket.setDefaultEdgeLabel([])
bracket.setDefaultNodeLabel({0: {}, 1:{}, score: []})
//step 1: create nodes

gameOrder.map(function(set){
    set.map(function(node){
        bracket.setNode(node)
    })
})

//step 2: create edges

gameOrder.map(function(set,setIndex){
    if(setIndex!=0 && setIndex!=6){
        set.map(function(node,nodeIndex){
            const targetNode = gameOrder[setIndex+1][Math.floor(nodeIndex/2)]
            const position = nodeIndex % 2 === 1 ? 1 : 0
            console.log([node, targetNode, position])
            bracket.setEdge(node, targetNode, {position:position})
        })
    }
})

//step 2.5 assign play-in games

//step 3 fill with teams




const getNextMatchup = (node)=>{
    const position = bracket.edge(bracket.outEdges(node)[0])["position"]
    const nextSlot = bracket.successors(node)[0]
    return {nextSlot: nextSlot, position: position}
}


const advance = (position, node)=>{
    const team = bracket.node(node)[position]
    const nextMatchup = getNextMatchup(node)
    let label = bracket.node(nextMatchup.nextSlot)
    label[nextMatchup.position] = team;
    bracket.setNode(nextMatchup.nextSlot, label)
   // console.log(bracket.node(nextMatchup.nextSlot))
}

const populate = (region, team, seed)=>{
    const nodeLabel = `${region}1${seedMap[seed][0]}`
    let node = bracket.node(nodeLabel)
    node[seedMap[seed][1]] = team
    bracket.setNode(nodeLabel, node)
}

const populatePlayIn = (region, teams, seed)=>{
    const label = `P${region}0${seed}`
    gameOrder[0].push(label)
    bracket.setNode(label, {0: teams[0], 1:teams[1], score: []})
    const targetNode = `${region}1${seedMap[seed][0]}`
    bracket.setEdge(label, targetNode, {position: seedMap[seed][1]})
    //bracket.setEdge(first4node, targetNode, position)
}

//console.log(bracket.successors('W2B'))

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
    14: ["H", 1],
}