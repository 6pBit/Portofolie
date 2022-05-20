import React from "react";
import './Sidebar.css'
import profileImg from './profile-icon-png-black.png'

/**
 * Puts together the image and name, from the database, of the owner and diplays it
 * @returns Header Component
 */

export default function Header() {

    const [user, setUser] = React.useState({})

    React.useEffect(() => {
        fetch('/user')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setUser(JSON.parse(data.message))
        })
        
    },[])
    console.log(user)
    return (
        <div className="sidebar-header">
            <img src={ user.bildelenke || profileImg} />
            <h1 className="sidebar-logo" > { `${user.fornavn} ${user.etternavn}`|| "portefølje" } </h1>
        </div>
    )
}