import React from "react";
import './Sidebar.css'

export default function Nav(props) {

    function handleClick(e, target) {
        e.preventDefault();
        const location = document.querySelector(target)
        document.querySelector("#mainContainer").scroll({
            left: 0,
            top: location.offsetTop,
            behavior: 'smooth'
        })
        console.log(`Nav.js før setvisible ${props.sidebarVisible}`)
        props.setSidebarVisible(!props.sidebarVisible)
        console.log(`Nav.js etter setvisible ${props.sidebarVisible}`)
        /*
        if(props.sidebarVisible) {
            document.getElementById('Sidebar').style.transform = 'translateY(0%)'                       
        } else {
            document.getElementById('Sidebar').style.transform = 'translateY(-100%)'
        }
        */
    }
    
    return (
        <ul className="sidebar-items">
            <div id="sidebarlanding" className="item" onClick={(e) => handleClick(e, '#landing')} >
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