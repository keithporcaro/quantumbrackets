import m from "mithril"
import {Model, Generate, newSeed} from "../src/model/model"


const getChamp = ()=>{
    const game = Model.bracket.node("F6A")
    const champ = game.score[0] > game.score[1] ? game["0"]["Team"] : game["1"]["Team"]
    return champ
}

const newRoute = ()=>{
    const seed = newSeed()
    m.route.set(`/b/:key`,{key: seed} )
    m.redraw()
}
const MainView = {
    oninit: (vnode)=>{
        vnode.attrs.seed ? Generate(vnode.attrs.seed) : Generate()
    },
    view: (vnode)=>{
        return m("div", [
            m("div", {class:"Inter"}, [
                m("p", {class:"f1 fw7"}, `In timeline #${Model.seed}, the 2020 national champion is ${getChamp()}.`),
                m(m.route.Link, {href: "/b/1234", selector:"button"},"click")              
            ]),
            m("div", {class:"flex margin-auto"},[
                m("div",{class:"mh4"},[
                    m(regionView, {region: "M"}),
                    m(regionView, {region: "W"}), 
                ]),
                m("div",{class:"mh4 flex justify-center"},[
                    m(fifthRoundView)
                ]),
                m("div",{class:"mh4"},[
                    m(regionView, {region: "S", reverse: true}),
                    m(regionView, {region: "E", reverse: true}),
                    
                ])
                  
            ])
        ])
        
     
    }
}

const regionView = {
    view: (vnode)=>{
        return m("div",{class:`flex ${vnode.attrs.reverse ? "flex-row-reverse": ""}`}, [
            m(firstRoundView, {region: vnode.attrs.region}),
            m(secondRoundView, {region: vnode.attrs.region}),
            m(thirdRoundView, {region: vnode.attrs.region}), 
            m(fourthRoundView, {region: vnode.attrs.region}), 
        ])
    }
}

const firstRoundView = {
    view: (vnode)=>{
        return m("dt", {class:"h-100 mv4 mh3 flex flex-column justify-around" },[
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}1A`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}1B`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}1C`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}1D`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}1E`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}1F`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}1G`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}1H`)}),
        ])
    }
}

const secondRoundView = {
    view: (vnode)=>{
        return m("dt", {class:"h-auto mv4 v-mid flex flex-column justify-around" },[
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}2A`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}2B`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}2C`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}2D`)}),
        ] )
    }
}

const thirdRoundView = {
    view: (vnode)=>{
        return m("dt", {class:"h-auto mv4 v-mid flex flex-column justify-around" },[
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}3A`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}3B`)}),
        ] )
    }
}

const fourthRoundView = {
    view: (vnode)=>{
        return m("dt", {class:"h-auto mv4 v-mid flex flex-column justify-around" },[
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}4A`)}),
        ] )
    }
}

const fifthRoundView = {
    view: (vnode)=>{
        return m("dt", {class:"h-auto mv4 v-mid flex flex-column justify-center" },[
            m(semiFinalView,{game: Model.bracket.node(`F5A`)}),
            m(finalView,{game: Model.bracket.node(`F6A`)}),
            m(semiFinalView,{game: Model.bracket.node(`F5B`)}),
            
        ] )
    }
}

const gameView = {
    view: (vnode)=>{
        console.log(vnode.attrs.game)
        return m("dtc", {class:"v-mid mv2 ph2 pv1 f6 Inter w5 ba bw1 b--light-gray"},[
           m("p", {class:`${vnode.attrs.game["score"][1] > vnode.attrs.game["score"][0] ? "fw4" : "fw7"}`},`(${vnode.attrs.game["0"]["Seed"]}) ${vnode.attrs.game["0"]["Team"]}: ${vnode.attrs.game["score"][0]}`),
           m("p", {class:`${vnode.attrs.game["score"][0] > vnode.attrs.game["score"][1] ? "fw4" : "fw7"}`},`(${vnode.attrs.game["1"]["Seed"]}) ${vnode.attrs.game["1"]["Team"]}: ${vnode.attrs.game["score"][1]}`),
        ])
    }
}

const semiFinalView = {
    view: (vnode)=>{
        console.log(vnode.attrs.game)
        return m("dtc", {class:"v-mid mv2 ph2 pv1 f6 Inter w5 ba bw1 b--gray"},[
           m("p", {class:`${vnode.attrs.game["score"][1] > vnode.attrs.game["score"][0] ? "fw4" : "fw7"}`},`(${vnode.attrs.game["0"]["Seed"]}) ${vnode.attrs.game["0"]["Team"]}: ${vnode.attrs.game["score"][0]}`),
           m("p", {class:`${vnode.attrs.game["score"][0] > vnode.attrs.game["score"][1] ? "fw4" : "fw7"}`},`(${vnode.attrs.game["1"]["Seed"]}) ${vnode.attrs.game["1"]["Team"]}: ${vnode.attrs.game["score"][1]}`),
        ])
    }
}
const finalView = {
    view: (vnode)=>{
        console.log(vnode.attrs.game)
        return m("dtc", {class:"v-mid mv2 ph2 pv1 f6 Inter w5 ba bw1 b--black"},[
           m("p", {class:"ttu f7 mid-gray"}, "National championship"),
           m("p", {class:`${vnode.attrs.game["score"][1] > vnode.attrs.game["score"][0] ? "fw4" : "fw7"}`},`(${vnode.attrs.game["0"]["Seed"]}) ${vnode.attrs.game["0"]["Team"]}: ${vnode.attrs.game["score"][0]}`),
           m("p", {class:`${vnode.attrs.game["score"][0] > vnode.attrs.game["score"][1] ? "fw4" : "fw7"}`},`(${vnode.attrs.game["1"]["Seed"]}) ${vnode.attrs.game["1"]["Team"]}: ${vnode.attrs.game["score"][1]}`),
        ])
    }
}

export { MainView }