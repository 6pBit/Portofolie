import React from 'react'
import './css/Landing.css'

/**
 * The home page which meets the guest with a welcome message and an introduction
 * @returns Landing Component
 */
export default function Landing() {
    const [landingContent, setLandingContent] = React.useState({})
    React.useEffect(() => {
        fetch('/sites/landing')
        .then(response => response.json())
        .then(data => {
            setLandingContent(data )
        })
    },[])   

    return (
        <section className="landingContainer" id='landing'>
            <div className="animatedContainer" >
                <h1 >{landingContent.title || "Velkommen"}</h1>
                <div className="introductionTxtContainer">
                    <p >{landingContent.introductionTxt || "En introduksjonstekst"}</p>
                </div>
            </div>
        </section>
    )
}