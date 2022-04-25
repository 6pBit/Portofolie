import React from "react"
import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'
import './Sidebar.css'

export default function Sidebar(props) {
    
    return (
        <div className={props.isVisible ? "Sidebar": "Sidebar collapsed"}>
            <div className="sidebar-fixed-wrapper">
                <Header />
                <Nav handleAdminRouting={props.handleMenuVisibility}/>
                <Footer handleAdminRouting={props.handleMenuVisibility} screen={props.screen} setScreen={props.setScreen}/>
            </div>
        </div>
    )
}