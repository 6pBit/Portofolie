import React from "react"
import Landing from "./Landing"
import Project from './Project'
import Resume from "./Resume"
import Contact from './Contact'
import Edit from '../edit/Edit'
import './css/Main.css'
import '../sidebar/Sidebar.css'

export default function Main(props) {

    const [sections, setSections] = React.useState(document.querySelectorAll("section[id]"))
    const sectionsArr = document.querySelectorAll("section")
    console.log('onscroll kjører'+sectionsArr[0])
    function navHighlighter() {
        console.log('onscroll kjører'+sections)
        let scrollY = (document.getElementById('landing').getBoundingClientRect().top*(-1))
        console.log('onscroll kjører'+scrollY)
        for(let i = 0; i < sections.length; i++) {
            const sectionHeight = sections[i].offsetHeight
            const sectionTop = sections[i].offsetTop - 50
            const sectionId = sections[i].getAttribute('id')
            console.log('onscroll kjører' + sectionHeight+" "+sectionTop)
            if (
                scrollY > sectionTop &&  
                scrollY <= sectionTop + sectionHeight
            ){
                console.log('onscroll kjører '+sectionId)
                document.querySelector('.sidebar-items div[onClick={(e) => handleClick(e, '+sectionId+']').classList.add('activeSidebarlink')
            } else {
                document.querySelector('.sidebar-items div[onClick={(e) => handleClick(e, '+sectionId+']').classList.remove('activeSidebarlink')
            }
        }
        
    }
    //const navRefList = props.navRefList ref={navRefList[0].landingRef}


    return (
        <div id="mainContainer" className="main" onScroll={navHighlighter}>
            <Landing />
            <Project />
            <Resume />
            <Contact />
            
        </div>
    )
}
