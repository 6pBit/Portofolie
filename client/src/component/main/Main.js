import React from "react"
import Landing from "./Landing"
import Project from './Project'
import Resume from "./Resume"
import Contact from './Contact'
import Edit from '../edit/Edit'
import './css/Main.css'

export default function Main(props) {

    const [state, setState] = React.useState(null)

    return (
        <div id="mainContainer" className="main" onScroll={(e) => console.log(e+" Event")}>
            <Landing />
            <Project />
            <Resume />
            <Contact />
            <Edit />
        </div>
    )
}
