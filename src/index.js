import m from "mithril"

import Layout from "../src/view/layout"
import {MainView} from "./view/view"
import {newSeed} from "./model/model"


     m.route(document.body, "/",{
        
       
        "/":{
            onmatch: ()=>{
                const seed = newSeed();
                m.route.set(`/${seed}`)
            }
        }, 
        "/:key":{
            view: ()=>{
                window.scrollTo(0,0);
                return m(Layout, {title: "",
                key: m.route.param("key"),
                step: null,
                nextLink: null,
                nextCopy: null,
                prevLink: null,
                prevCopy: null, }, [
                    m(MainView, {seed:m.route.param("key")})
                ])
            }
        }
    })

    //

     
   