import React from "react";
import './Sidebar.css'
import profileImg from './profile-icon-png-black.png'

export default function Header() {
    return (
        <div className="sidebar-header">
            <img src={"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" || profileImg} />
            <h1 className="sidebar-logo" > Portefølje</h1>
        </div>
    )
}