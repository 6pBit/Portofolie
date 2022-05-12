import React from "react";
import { Element } from 'react-scroll'
import './css/Resume.css'

export default function Resume() {
    return (
        
            <section id="resume" className="resumeContainer">
                <h1>Resume</h1>
                <div className="cvContainer">
                    <embed width="auto" height="70vh" src="http://localhost:3001/public/files/096a8bd5-567c-40f5-a1fd-578042325631-filecv_til_nettside.pdf" />
                </div>
            </section>
        
    )
}