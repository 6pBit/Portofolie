import React from "react";
import './Sidebar.css'

/**
 * Makes the navigation buttons and defines how to behave when they are pressed
 * @param {*} props 
 * @returns Nav Component
 */

export default function Nav(props) {
    /**
     * Scrolls up or down to find the corresponding component in mainContainer
     */
    function handleClick(e, target) {
        e.preventDefault();
        const location = document.querySelector(target)
        document.querySelector("#mainContainer").scroll({
            left: 0,
            top: location.offsetTop,
            behavior: 'smooth'
        })
        props.setSidebarVisible(!props.sidebarVisible)      
    }
    
    return (
        <ul className="sidebar-items">
            <div id="sidebarlanding" className="item activeSidebarlink" onClick={(e) => handleClick(e, '#landing')} >
                <span className="sidebar-text">Hjem</span>
            </div>            
            <div id="sidebarproject" className="item" onClick={(e) => handleClick(e, '#project')}>
                <span className="sidebar-text">Prosjekt</span>
            </div>            
            <div id="sidebarresume" className="item" onClick={(e) => handleClick(e, '#resume')}>
                <span className="sidebar-text">Resume</span>
            </div>            
            <div id="sidebarcontact" className="item" onClick={(e) => handleClick(e, '#contact')}>
                <span className="sidebar-text">Kontakt</span>
            </div>            
        </ul>
    )
}