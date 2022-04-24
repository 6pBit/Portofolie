import React from 'react'
import {BsGearFill} from 'react-icons/bs'
import { Link } from 'react-router-dom'
import './Sidebar.css'

export default function Footer(props) {
    return(
        <div className='footer'>
            <h3>Footer</h3>
            <Link to="/admin" onClick={props.handleAdminRouting}><BsGearFill /></Link>
            
        </div>
    )
}