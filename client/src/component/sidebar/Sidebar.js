import React from "react"
import Header from './Header'
import Nav from './Nav'
import './Sidebar.css'

export default function Sidebar() {
    
    

    return (
        <div className="Sidebar">
            <div className="sidebar-fixed-wrapper">
                <Header />
                <Nav />
            </div>
        </div>
    )
}