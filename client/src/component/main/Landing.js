import React from 'react'
import './css/Landing.css'

export default function Landing() {
    const [landingContent, setLandingContent] = React.useState({})
    React.useEffect(() => {
        fetch('/sites/landing')
        .then(response => response.json())
        .then(data => {
            setLandingContent(data)
        })
    },[])
    

    return (
        <section className="landingContainer" id='landing'>
            <h1 >{landingContent.title || "Velkommen"}</h1>
            <p >{landingContent.introductionTxt || "En introduksjonstekst"}</p>
        </section>
    )
}