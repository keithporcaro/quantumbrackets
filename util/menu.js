import m from "mithril"



const MenuItems = {
    "loggedin": [
        {
            name: "Home",
            link: "/",
            singlet: true,
            slug: "Go home."
        },
        {
            name: "Data",
            link: "/",
            singlet: false,
            slug: "Go home.",
            subitems:[
                {
                    name: "Data subitem",
                    link: "/",
                    slug: "Here is a subitem."
                }, 
            ]
        }
    ]
}

const Menu = {
    showMenu: false,
    view: (vnode)=>{
        return m("div", {"class":"fixed w-100 h-100 z-4 overflow-x-hidden top-0 left-0 overflow-y-hidden","id":"sidecover","style":{"pointer-events":`${Menu.showMenu ? "all" : "none"}`}},
        [
          m("div", {"class":"right-0 h-100 absolute z-4 bg-white border-box overflow-y-scroll","id":"sidemenu","style":{"transform":`${Menu.showMenu ? "" : "translateX(100%)"}`,"transition":"transform .35s"}},
            [
              m("a", {"class":"w-100 pointer right-0 absolute pa3 pt4 mono fw7 f3-ns f4 ttu hover-red v-mid mid-gray link tr mb2 mb0-l","onclick":()=>{Menu.showMenu = false},"title":"Home"}, 
                "x"
              ),
              vnode.attrs.items.map((item)=>{
                  return item.singlet ? m(MenuSinglet, item) : m(MenuWithSubitems, item)
              })
            ]
          ),
          m("div", {"class":"bg-black w-100 h-100 border-box","onclick":()=>{Menu.showMenu=false},"id":"overlay","style":{"opacity":`${Menu.showMenu ? .6 : 0}`,"transition":"opacity .35s"}})
        ]
      )
    }
}

const MenuSinglet = {
    view: (vnode)=>{
        return m("div", {"class":"center pt5-ns pt4 ph5-ns ph4"}, 
        m("div", {"class":"dt mw6 pv4-ns pv3 spartan"},
          [
            m("div", {"class":"pv0"}, 
              m("p", {"class":"mv3 black f2-ns f3"}, 
                m("a", {"class":"link black hover-blue","href":vnode.attrs.link}, 
                  vnode.attrs.name
                )
              )
            ),
            m("div", {"class":"db w-100 gray f6"}, 
              vnode.attrs.slug
            )
          ]
        )
      )
    }
}

const MenuWithSubitems = {
    open: false,
    view: (vnode)=>{
        return m("div", {"class":"center ph5-ns ph4"}, 
        m("div", {"class":"dt mw6 pv4-ns pv3 spartan pointer"},
          [
            m("div", {"class":"pv0","onclick":()=>{vnode.state.open=!(vnode.state.open)} }, //toggle
              [
                m("p", {"class":"mv3 black f2-ns f3"}, 
                m("a", {"class":"link black hover-blue"}, 
                  vnode.attrs.name
                )
              )
              ]
            ),
            m("div", {"class":"db w-100 gray f6"}, 
              vnode.attrs.slug
            ),
            m("div", {"class":`${vnode.state.open ? "dt" : "dn"} mw6 pv2 spartan black`}, //toggle
              m("div", {"class":"pv0"},
                vnode.attrs.subitems.map((subitem)=>{
                    return m(MenuSubitem, {link: subitem.link, name: subitem.name})
                })
              )
            )   
          ]
        )
      )
    }
}

const MenuSubitem = {
    view:(vnode)=>{
        return  m("p", {"class":"mv3 f4"}, 
        m("a", {"class":"link black hover-blue","href":vnode.attrs.link}, 
          vnode.attrs.name
        )
      )
    }
}

export {Menu, MenuItems}