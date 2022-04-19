import React from "react"
import Landing from "./Landing"
import Project from './Project'
import Resume from "./Resume"
import Contact from './Contact'
import Edit from '../edit/Edit.js'
import './css/Main.css'

export default function Main() {


    return (
        <div id="mainContainer" className="main" onScroll={(e) => console.log(e+" Event")}>
            <Landing />
            <Project />
            <Resume />
            <Contact />
            <Edit/>
        </div>
    )
}
