import React from "react"
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'
import './Sidebar.css'

export default function Sidebar(props) {

    const location = useLocation() 

    React.useEffect(() => {        
            console.log(`You changed the page to: ${location.pathname}`)          
    },[location])
    
    return (
        <div className={location.pathname === '/admin' && props.screen !== 'auth' ? "Sidebar collapsed": "Sidebar"}>
            <div className="sidebar-fixed-wrapper">
                <Header />
                <Nav />
                <Footer screen={props.screen} setScreen={props.setScreen}/>
            </div>
        </div>
    )
}