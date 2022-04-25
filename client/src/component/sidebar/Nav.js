import React from "react";
import './Sidebar.css'
import { Link } from 'react-router-dom'
import { propTypes } from "react-bootstrap/esm/Image";

export default function Nav() {

    function handleClick(e, target) {
        e.preventDefault();
        const location = document.querySelector(target)
        document.querySelector("#mainContainer").scroll({
            left: 0,
            top: location.offsetTop,
            behavior: 'smooth'
        })
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