import React from "react";
import './Sidebar.css'
import { Link } from 'react-router-dom'
import { propTypes } from "react-bootstrap/esm/Image";

export default function Nav(props) {

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
            <div className="item" onClick={(e) => handleClick(e, '#landing')} >
                <span className="sidebar-text">Hjem</span>
            </div>            
            <div className="item" onClick={(e) => handleClick(e, '#project')}>
                <span className="sidebar-text">Prosjekt</span>
            </div>            
            <div className="item" onClick={(e) => handleClick(e, '#resume')}>
                <span className="sidebar-text">Resume</span>
            </div>            
            <div className="item" onClick={(e) => handleClick(e, '#contact')}>
                <span className="sidebar-text">Kontakt</span>
            </div>
            <Link to="/admin" onClick={props.handleAdminRouting}>Admin</Link>
            
        </ul>
    )
}