import React from 'react'
import './css/Landing.css'

export default function Landing() {
    const [landingContent, setLandingContent] = React.useState({})
    React.useEffect(() => {
        fetch('/sites/landing')
        .then(response => response.json())
        .then(data => {
            setLandingContent(data )
        })
        console.log(landingContent)
        return () => () => console.log("callback "+landingContent)
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