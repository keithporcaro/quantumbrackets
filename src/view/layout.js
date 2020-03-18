import m from "mithril"


const Layout = {
    
    view: (vnode)=>{
      const path = (m.route.get()==="") || (m.route.get()==="/report") || (m.route.get()==="/results") 
        return [
            m("nav", {"class":"dt w-100  border-box center pa3 pb3-ns pb0 ph5-l"},
              [
                m("a", {"class":"dtc v-mid mid-gray  tl mb1","href":"https://smallscale.org","title":"Home"},
                  [
                    m("img", {"class":"dib h3","src":"static/longpink.png","alt":"small scale"}),

                  ]
                ),
              ]
            ), 
            m("article", {"class":"pa3 pa5-ns pt3-ns pt0 mw10 center spvar fw4 near-black vh-100"},
              [

                m("section", {"class":"f4-ns f5 lh-copy"}, 
                 vnode.children
                ),

              ]
            ), 

          /*  m("footer", {"class":"dt w-100 border-box center pb0 v-bottom"},[
             m("div",[
                m("div", {"class":"h1 pv1 w-100 dt", style:"background-color: hsl(27,100%,70%)"}, " "),
                m("div", {"class":"h1 pv1 w-100 dt",  style:"background-color: hsl(8,67%,60%)"}," "),
                m("div", {"class":"h1 pv1 w-100 dt",  style:"background-color: hsl(330,50%,40%)"}," "),
              ]),
              m("div", {"class":" h4 pv3 ph5-ns ph3 w-100 dt",  style:"background-color: hsl(234,55%,16%)"},[
                

              ]),
            ]),*/
          ]
    }
}

export default Layout