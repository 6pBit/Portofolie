import React from "react"
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'
import './Sidebar.css'

export default function Sidebar(props) {

    const location = useLocation() 
    const [sidebarClassname, setSidebarClassname] = React.useState("Sidebar")
    

    React.useEffect(() => {        
            console.log(`You changed the page to: ${location.pathname} and changed sidebarVisible ${props.sidebarVisible}`)  
            setSidebarClassname(() => {                
                let sidebarClass = ((window.innerWidth > 600 ? location.pathname === '/admin' && props.screen !== 'auth' : !props.sidebarVisible)
                    ? "sidebar collapsed"
                    : "sidebar"
                )
                if(window.innerWidth < 600){
                    if(props.sidebarVisible ) {
                        document.getElementById('Sidebar').style.transform = 'translateY(0%)'                       
                    } else {
                        document.getElementById('Sidebar').style.transform = 'translateY(-100%)'
                    }
                }
                console.log(`setSidebarClassname: ${sidebarClassname} ${sidebarClass} `)  
                return sidebarClass
            })
    },[location,props.sidebarVisible])
    
    return (
        <div id="Sidebar" className={sidebarClassname}  >
            <div className="sidebar-fixed-wrapper">
                <Header />
                <Nav sidebarVisible={props.sidebarVisible} setSidebarVisible={props.setSidebarVisible} />
                <Footer screen={props.screen} setScreen={props.setScreen} />
            </div>
        </div>
    )
}