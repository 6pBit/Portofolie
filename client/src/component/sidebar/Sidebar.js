import React from "react"
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'
import './Sidebar.css'

/**
 * Puts together the Sidebar and figures out whether it should stay visible or collapse
 * Refrence: https://juchazari.medium.com/persisting-a-sidebars-expanded-collapsed-state-with-react-and-local-storage-69e9d6feb52b
 * @param {*} props 
 * @returns Sidebar Component
 */

export default function Sidebar(props) {

    const location = useLocation() 
    const [sidebarClassname, setSidebarClassname] = React.useState("Sidebar")    

    React.useEffect(() => { 
            setSidebarClassname(() => {  // uses screen size, sucsesful login and routing to figure out whether it should stay open or not              
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