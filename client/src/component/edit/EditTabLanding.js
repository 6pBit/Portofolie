import React from "react"
import { Container } from "react-bootstrap"

export default function EditTabLanding(props) {

    const collection = "sites"
    const dbFilter = "landing"
    const isMounted = React.useRef(false)
 
    const [siteData, setSiteData] = React.useState({
        title: "",
        introductionTxt: ""
    })
    const [oldSiteData, setOldSiteData] = React.useState({
        title: "",
        introductionTxt: ""
    }) 

    function handleChange(event) {
        console.log(event.target.value)
  
        setSiteData(prevSiteData => {
          return {
            ...prevSiteData,
            [event.target.name]: event.target.value
          }
        })
    }

    function handleSubmit(event){
        event.preventDefault();
        setOldSiteData( {
         ...siteData
        })
    }

    React.useEffect(() => {
        fetch("/sites/landing")
        .then(response => response.json())
        .then(data => (
            setOldSiteData( {
                title: data.title,
                introductionTxt: data.introductionTxt
            }),
            setSiteData({
                title: data.title,
                introductionTxt: data.introductionTxt
            })
        ))
    }, [])

    React.useEffect(() => {
        if(isMounted.current) {
            const requestForDatabase = {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(
                oldSiteData
              )
            }
            fetch(`/${collection}/${dbFilter}`, requestForDatabase )
              .then( response => {
                console.log("fetch resultat etter post fra Editlanding.js " + response.json())
                //setCurrentData(JSON.stringify(response.json()))
            })
          } else {
            isMounted.current = true
          }
    }, [oldSiteData])




    return(
        <Container>
            
            <div className="current_info">
                <article>
                    <p>Current Title: {oldSiteData.title}</p>
                    <p>Current Introduciton Text: {oldSiteData.introductionTxt}</p>
                </article>
            </div>

            <input 
                type="text"
                placeholder="Title for Landing"
                name="title"
                onChange={handleChange}
                value={siteData.title}
            />
            <input 
                type="textarea"
                placeholder="Introduction Text"
                name="introductionTxt"
                onChange={handleChange}
                value={siteData.introductionTxt}
            />

            <input
                type="button"
                name="siteSubmit"
                value="Submit Changes"
                onClick={handleSubmit}
            />
            
        </Container>
    )

}

/*

<form>
                <input 
                    type="text" 
                    placeholder="Title"
                    onChange={handleChange} //må endres
                    name="title"
                    value={siteData.title}
                />
                <input
                    type="text"
                    placeholder="Inctroduction Text"
                    onChange={props.handleChange}
                    name="introductionTxt"
                    value={props.siteData.introductionTxt}
                />
                <input
                    type="file"
                    onChange={props.handleChange}
                    name="fileUpload"
                />
                <input
                    type="button"
                    onClick={props.handleSubmit}

                />
            </form>


*/