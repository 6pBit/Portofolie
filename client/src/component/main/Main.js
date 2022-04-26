import React from "react"
import Landing from "./Landing"
import Project from './Project'
import Resume from "./Resume"
import Contact from './Contact'
import Edit from '../edit/Edit'
import './css/Main.css'
import '../sidebar/Sidebar.css'

export default function Main() {

    const [sectionsArr, setSectionsArr] = React.useState([])
    //let sectionsArr
    //console.log('sections on render '+Array.from(document.querySelectorAll("section")))
    function navHighlighter() {
        
        let scrollY = (document.getElementById('landing').getBoundingClientRect().top*(-1))
        //console.log(sectionsArr)
        for(let i = 0; i < sectionsArr.length; i++) {
            const sectionHeight = sectionsArr[i].offsetHeight
            const sectionTop = sectionsArr[i].offsetTop - 500
            const sectionId = sectionsArr[i].getAttribute('id')
            //console.log('onscroll forloop kjører ' + sectionHeight+" "+sectionTop)
            if (
                scrollY > sectionTop &&  
                scrollY <= sectionTop + sectionHeight
            ){
                //console.log('onscroll inne i ifen kjører '+sectionId)
                document.querySelector('#sidebar'+sectionId).classList.add('activeSidebarlink')
            } else {
                document.querySelector('#sidebar'+sectionId).classList.remove('activeSidebarlink')
            }
        }
        
    }
    React.useEffect(() => {
        setSectionsArr(Array.from(document.querySelectorAll("section")))
    },[])
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
