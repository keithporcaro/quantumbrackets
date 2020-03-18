import m from "mithril"
import {Model, Generate, newSeed} from "../model/model"


const getChamp = ()=>{
    const game = Model.bracket.node("F6A")
    const champ = game.score[0] > game.score[1] ? game["0"]["Team"] : game["1"]["Team"]
    return champ
}

const newRoute = (seed = newSeed())=>{
    m.route.set(`/:key`,{key: seed} )
 //   m.redraw()
}
let inputField = 0
let submitField = ""

const MainView = {
    oninit: (vnode)=>{
        vnode.attrs.seed ? Generate(vnode.attrs.seed) : Generate()
    },
    view: (vnode)=>{
        return m("div", [
            m("div", {class:"Inter mt3 mb4"}, [
                m("p", {class:"f1-ns f4 fw7"}, [`In alternate timeline `,
                                            m("span",{class:"blue"},`#${Model.seed}`), 
                                            `, the 2020 national champion is `,
                                            m("span",{class:"dark-red"},`${getChamp()}`),
                                            ` and `,
                                            m("span",{class:"purple"},`${Model.description}`),
                                            `.`
                                        ]),
                m("div", {class:"flex flex-wrap f5"}, [
                    m("a",{class:"br2 mv3 mr3 bg-light-blue hover-bg-light-red pa3 black fw7 pointer Inter", onclick:()=>{newRoute()}},"Visit a random timeline"),
                    m("div",{class:"flex mv3"},[m("a",{class:"br2 bg-lightest-blue hover-bg-light-red pa3 black fw7 pointer Inter", onclick:()=>{newRoute(inputField)}},"Visit"),
                    m("input", {oninput:(e)=>{inputField=e.target.value}, value:inputField, class:"ml1 mr3 input-reset bn pa3 Inter fw7 br2 bg-lightest-blue", type:"number"})]),

                    m("a",{class:"br2 bg-yellow mv3 hover-bg-gold pa3 link black fw7 mr3 pointer no-decoration Inter", href:"https://www.buzzfeednews.com/article/tasneemnashrulla/coronavirus-covid19-organizations-help-food-medical-aid"},"Places to donate in our timeline"),
                    m("a",{class:"br2 bg-light-purple mv3 hover-bg-purple pa3 link white fw7 pointer no-decoration Inter", href:"https://docs.google.com/forms/d/1UFuXyH0wW908aW9awQGIdBvd4g8ytcdM63esk5ilvLY/viewform"},"Tell us about other timelines"),
                ]),
              
               
                   
               // m("input",{type:"number", class:"input"}),
            ]),
            m("div", {class:"flex margin-auto"},[
                m("div",{class:""},[
                    m(regionView, {region: "M"}),
                    m(regionView, {region: "W"}), 
                ]),
                m("div",{class:"mh4 flex justify-center"},[
                    m(fifthRoundView)
                ]),
                m("div",{class:""},[
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
        return m("dt", {class:"h-100 mv3 mh1 flex flex-column justify-around" },[
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
        return m("dt", {class:"h-auto mv3 mh1 v-mid flex flex-column justify-around" },[
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}2A`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}2B`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}2C`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}2D`)}),
        ] )
    }
}

const thirdRoundView = {
    view: (vnode)=>{
        return m("dt", {class:"h-auto mv3 v-mid flex flex-column justify-around" },[
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}3A`)}),
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}3B`)}),
        ] )
    }
}

const fourthRoundView = {
    view: (vnode)=>{
        return m("dt", {class:"h-auto mv3 v-mid flex flex-column justify-around" },[
            m(gameView,{game: Model.bracket.node(`${vnode.attrs.region}4A`)}),
        ] )
    }
}

const fifthRoundView = {
    view: (vnode)=>{
        return m("dt", {class:"h-auto mv3 v-mid flex flex-column justify-center" },[
            m(semiFinalView,{game: Model.bracket.node(`F5A`)}),
            m(finalView,{game: Model.bracket.node(`F6A`)}),
            m(semiFinalView,{game: Model.bracket.node(`F5B`)}),
            
        ] )
    }
}

const gameView = {
    view: (vnode)=>{
        console.log(vnode.attrs.game)
        return m("dtc", {class:"v-mid mv1 pl2 pv1 f6 Inter wm ba bw1 b--light-gray"},[
           m("p", {class:`${vnode.attrs.game["score"][1] > vnode.attrs.game["score"][0] ? "fw4" : "fw7"}`},`(${vnode.attrs.game["0"]["Seed"]}) ${vnode.attrs.game["0"]["Team"]}: ${vnode.attrs.game["score"][0]}`),
           m("p", {class:`${vnode.attrs.game["score"][0] > vnode.attrs.game["score"][1] ? "fw4" : "fw7"}`},`(${vnode.attrs.game["1"]["Seed"]}) ${vnode.attrs.game["1"]["Team"]}: ${vnode.attrs.game["score"][1]}`),
        ])
    }
}

const semiFinalView = {
    view: (vnode)=>{
        console.log(vnode.attrs.game)
        return m("dtc", {class:"v-mid mv2 pl2 pv1 f6 Inter wm ba bw1 b--gray"},[
           m("p", {class:`${vnode.attrs.game["score"][1] > vnode.attrs.game["score"][0] ? "fw4" : "fw7"}`},`(${vnode.attrs.game["0"]["Seed"]}) ${vnode.attrs.game["0"]["Team"]}: ${vnode.attrs.game["score"][0]}`),
           m("p", {class:`${vnode.attrs.game["score"][0] > vnode.attrs.game["score"][1] ? "fw4" : "fw7"}`},`(${vnode.attrs.game["1"]["Seed"]}) ${vnode.attrs.game["1"]["Team"]}: ${vnode.attrs.game["score"][1]}`),
        ])
    }
}
const finalView = {
    view: (vnode)=>{
        console.log(vnode.attrs.game)
        return m("dtc", {class:"v-mid mv2 pl2 pv0 f6 Inter wm ba bw1 b--black"},[
           m("p", {class:"ttu f7 mid-gray"}, "National championship"),
           m("p", {class:`${vnode.attrs.game["score"][1] > vnode.attrs.game["score"][0] ? "fw4" : "fw7"}`},`(${vnode.attrs.game["0"]["Seed"]}) ${vnode.attrs.game["0"]["Team"]}: ${vnode.attrs.game["score"][0]}`),
           m("p", {class:`${vnode.attrs.game["score"][0] > vnode.attrs.game["score"][1] ? "fw4" : "fw7"}`},`(${vnode.attrs.game["1"]["Seed"]}) ${vnode.attrs.game["1"]["Team"]}: ${vnode.attrs.game["score"][1]}`),
        ])
    }
}

export { MainView }