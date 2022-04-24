import { Dropdown } from "bootstrap"
import React from "react"
import {Container, DropdownButton} from "react-bootstrap"

export default function EditTabProject(props) {

    const collection = "projects"
    const dbFilter = "mitt_forst"
    const isMounted = React.useRef(false)
 
    const [formData, setFormData] = React.useState({
        title: "",
        description: ""
    })
    const [currentProject, setCurrentProject] = React.useState({
        title: "mitt_forst"
    })
    const [oldSiteData, setOldSiteData] = React.useState({
        title: "",
        description: ""
    })
    const [buttonArray, setButtonArray] = React.useState([
        
    ])


    function handleChange(event) {
        console.log(event.target.value)
  
        setFormData(prevFormData => {
          return {
            ...prevFormData,
            [event.target.name]: event.target.value
          }
        })
    }

    function handleSubmit(event){
        event.preventDefault();
        setOldSiteData( {
         ...formData
        })
    }

    React.useEffect(() => {
        fetch("/projects")
        .then(response => response.json())
        .then(data => (
           console.log(data + " data fra første fetch editprojectstab"),
           setButtonArray(data)
        )
    )}, [])

    React.useEffect(() => {
        if(isMounted.current) {
            fetch(`/projects/${currentProject.title}`)
            .then(response => response.json())
            .then(data => (

                setOldSiteData( {
                    title: data.title,
                    description: data.description

                }),

                setFormData({
                    title: data.title,
                    description: data.description

                }) 

            ))
        } 

    }, [currentProject])

    React.useEffect(() => {
        if(isMounted.current) {
            const requestForDatabase = {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(
                oldSiteData
              )
            }
            fetch(`/${collection}/${currentProject.title}`, requestForDatabase )
              .then( response => {
                console.log("fetch resultat etter post fra Editproject.js " + response.json())
                //setCurrentData(JSON.stringify(response.json()))
            })
          } else {
            isMounted.current = true
          }
    }, [oldSiteData])

    function helper(event) {
        setCurrentProject(() => {
            return {
                [event.target.name]: event.target.value
            }
        })
    }

    //Finn noe annet å ha nåværende prosjekter i. Kanskje list group eller lignende.
    return(
        <Container>
            
            <div className="current_info">
                <article>
                    <p>Current Title: {oldSiteData.title}</p>
                    <p>Current Description Text: {oldSiteData.description}</p>
                </article>
            </div>
            
            <DropdownButton id="dropdown-basic-button" title="Velg prosjekt">
                {buttonArray.map(project => {
                    <Dropdown.Item as="li">{project.title}</Dropdown.Item>
                })}
            </DropdownButton>

            <input 
                type="text"
                placeholder="Title for Project"
                name="title"
                onChange={handleChange}
                value={formData.title}
            />
            <input 
                type="textarea"
                placeholder="Description Text"
                name="description"
                onChange={handleChange}
                value={formData.description}
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