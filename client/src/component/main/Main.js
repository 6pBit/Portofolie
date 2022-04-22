import React from "react"
import Landing from "./Landing"
import Project from './Project'
import Resume from "./Resume"
import Contact from './Contact'
import Edit from '../edit/Edit'
import './css/Main.css'

export default function Main(props) {

    const [state, setState] = React.useState(null)
    const navRefList = props.navRefList

    return (
        <div id="mainContainer" className="main" onScroll={(e) => console.log(e+" Event")}>
            <Landing ref={navRefList[0].landingRef}/>
            <Project ref={navRefList[1].projectRef}/>
            <Resume ref={navRefList[2].resumeRef}/>
            <Contact ref={navRefList[3].contactRef}/>
            <Edit />
        </div>
    )
}
