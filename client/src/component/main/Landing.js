import React from 'react'
import './css/Landing.css'

export default function Landing() {
    const [landinContent, setLandinContent] = React.useState({
        title:'',
        introductionTxt:''
    })
    React.useEffect(() => {
        fetch('/sites/landing')
        .then(response => response.json())
        .then(data => {
            setLandinContent(data)
        })
    },[])
    

    return (
        <section className="landingContainer" id='landing'>
            <h1 >{landinContent.title}</h1>
            <p >{landinContent.introductionTxt}</p>
        </section>
    )
}