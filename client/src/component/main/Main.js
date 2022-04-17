import React from "react"
import Landing from "./Landing"
import Project from './Project'
import Resume from "./Resume"
import Contact from './Contact'
import './css/Main.css'

export default function Main() {


    return (
        <div id="mainContainer" className="main">
            <Landing />
            <Project />
            <Resume />
            <Contact />
        </div>
    )
}
