import React from "react"

import { NavLink } from 'react-router-dom';

import './Sideheader.css'

export default function Sideheader() {
    
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
        <div className="Sidebar">
            <div className="sidebar-fixed-wrapper">
                <div className="sidebar-header">
                    <h1 className="sidebar-logo" >Portefølje</h1>
                </div>
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
                </ul>
            </div>
        </div>
    )
}