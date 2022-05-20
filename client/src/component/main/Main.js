import React from "react"
import Landing from "./Landing"
import Project from './Project'
import Resume from "./Resume"
import Contact from './Contact'
import './css/Main.css'
import '../sidebar/Sidebar.css'

/**
 * Collects the mains components and calculates which component is in frame
 * @param {*} props 
 * @returns main Component
 */

export default function Main(props) {
    
    const [sectionsArr, setSectionsArr] = React.useState([])
    /**
     * Calculates which component is in frame and gives it a activesidebarlink class.
     */
    function navHighlighter() {        
        let scrollY = (document.getElementById('landing').getBoundingClientRect().top*(-1))
        for(let i = 0; i < sectionsArr.length; i++) {
            const sectionHeight = sectionsArr[i].offsetHeight
            const sectionTop = sectionsArr[i].offsetTop - 500
            const sectionId = sectionsArr[i].getAttribute('id')
            if (
                scrollY > sectionTop &&  
                scrollY <= sectionTop + sectionHeight
            ){
                document.querySelector('#sidebar'+sectionId).classList.add('activeSidebarlink')
            } else {
                document.querySelector('#sidebar'+sectionId).classList.remove('activeSidebarlink')
            }
        }        
    }
    React.useEffect(() => {
        if(window.innerWidth < 600) {
            props.setIsSidebarVisible(false)
        } else {
            props.setIsSidebarVisible(true)
        }
        setSectionsArr(Array.from(document.querySelectorAll("section")))
    },[])

    return (
        <div id="mainContainer" className="main" onScroll={navHighlighter}>            
            <Landing />
            <Project />
            <Resume />
            <Contact />            
        </div>
    )
}
