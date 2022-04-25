import React from "react"
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap"
import {Container, DropdownButton, ListGroup, Button} from "react-bootstrap"

export default function EditTabProject(props) {

    const collection = "projects"
    const dbFilter = "mitt_forst"
    const isMounted = React.useRef(false)

    const [currentOperation, setCurrentOperation] = React.useState({
        operation: ""
    })

    //bør være i en annen state

    const [wishToDelete, setWishToDelete] = React.useState(false)

    const [wishToUpdate, setWishToUpdate] = React.useState(false)

    const [currentProject, setCurrentProject] = React.useState({
        title: ""
    })
 
    const [formData, setFormData] = React.useState({
        title: "",
        description: "",
        altText: "",
        image: ""
    })
    
    const [siteData, setSiteData] = React.useState({
        title: "",
        description: "",
        altText: "",
        image: ""
    })

    const [listArray, setListArray] = React.useState([
        {
            title: ""
        }
    ])

    //Document blir noen ganger ikke oppdatert om man ikke også oppdaterer title på prosjektet
    React.useEffect(() => {

        if(isMounted.current) {
            const requestForDatabase = {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(
                siteData
              )
            }
            
            fetch(`/${collection}/${currentOperation.operation === "insert" ? "insert" : "update/" + currentProject.title}`, requestForDatabase )
            .then( response => {
            console.log("fetch resultat etter post fra Editproject.js " + response.json())
            })
          } else {}

          //Oppdaterer lista med prosjekter.
          updateList() 

    }, [wishToUpdate])

    React.useEffect(() => {
        if(isMounted.current) {
            fetch(`/projects/${currentProject.title}`)
            .then(response => response.json())
            .then(data => (

                setSiteData( {
                    title: data.title,
                    description: data.description,
                    altText: data.altText,
                    image: data.image
                }),

                setFormData({
                    title: data.title,
                    description: data.description,
                    altText: data.altText,
                    image: data.image
                }) 

            ))
        } else {}

    }, [currentProject.title])
    
    React.useEffect(() => {
        if(isMounted.current && !(currentProject.title === "")) {

            const requestForDatabase = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({})
            }  

            fetch(`/${collection}/delete/${currentProject.title}`, requestForDatabase )
            .then( response => {
                console.log("resultat etter sletting fra Editproject.js " + response.json())
                updateList()
            }) 
        } else {
            isMounted.current = true
        }
    }, [wishToDelete])

    function updateList() {
        fetch("/projects")
        .then(response => response.json())
        .then(data => (
           console.log(data + " data fra fetch editprojectstab"),
           setListArray(data)
        ))
    }

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
        if(formData.title !== "" && currentOperation.operation !== "delete") {
            setSiteData( {
                ...formData
            })
            setWishToUpdate(!wishToUpdate)
            updateList()
        } 
    }

    function handleDelete() {
        if(window.confirm("Du er iferd med å slette prosjektet: " +
                            currentProject.title + "\n" +
                            "Ønsker du å fortsette?")){
                                setWishToDelete(!wishToDelete)
                                //bør renske currentProject men noe rart med den
                                //Om den ikke fjernes blir man spurt om man vil slette den samme på nytt
                                //Uten param blir standard route (/) brukt
                                clean("formData")
                                clean("siteData")
                                
        } else {
            console.log("Sletting avbrutt")
        }
    }

    function helper(event) {
        console.log(event.target.name)
        setCurrentProject( {
            title: event.target.name
        })   
    }

    function operationHelper(event) {
        if(event.target.name === "insert") {
            clean("formData")
            clean("siteData")
        }
        setCurrentOperation({
            operation: event.target.name
        })
    }

    //Hjelpefunksjon som rensker valgt state for innhold.
    function clean(dataToClean) {
        if(dataToClean === "formData") {
            setFormData({
                title: "",
                description: "",
                altText: "",
                image: ""
            })
        }

        if(dataToClean === "siteData") {
            setSiteData({
                title: "",
                description: "",
                altText: "",
                image: ""
            })
        }

        if(dataToClean === "currentProject") {
            setCurrentProject({
                title: ""
            })
        }


    } 

    return(
        <Container>

            <div className="options mb-2 space-between">
                <p>Hva ønsker du å gjøre? Velg et alternativ:</p>

                <Button key="1" variant="primary" onClick={operationHelper} name="edit">Rediger et prosjekt</Button>
                <Button key="2" variant="primary" onClick={operationHelper} name="insert">Opprett nytt prosjekt</Button>    
                <Button key="3" variant="primary" onClick={operationHelper} name="delete">Slett et prosjekt</Button>
                
            </div>
            { !(currentOperation.operation === "insert" || currentOperation.operation === "delete" || currentOperation.operation === "") && 
                
                <Container>
                    <div className="current_info">
                        <article>
                            <p>Current Title: {siteData.title}</p>
                            <p>Current Description Text: {siteData.description}</p>
                            <p>Current altText: {siteData.altText}</p>
                            <img 
                                src={siteData.image}
                                alt={siteData.altText}
                            />
                        </article>
                    </div>
                </Container>
            }

            {!(currentOperation.operation === "insert" || currentOperation.operation === "") && 
                <Container>
                    <ListGroup defaultActiveKey={currentProject.title} title="Velg prosjekt">
                        {listArray.map((project) => 
                        <ListGroup.Item 
                            action onClick={helper}
                            name={project.title}
                            value={project.title}
                        >{project.title}</ListGroup.Item>)}
                    </ListGroup>
                </Container>
            }
                
            {!(currentOperation.operation === "delete" || currentOperation.operation === "") &&
                <Container className="input-container">
                    <input 
                        type="text"
                        placeholder="Title for Project"
                        name="title"
                        onChange={handleChange}
                        value={formData.title}
                    />
                    <textarea 
                        type="text"
                        placeholder="Description Text"
                        name="description"
                        onChange={handleChange}
                        value={formData.description}
                    />
                        
                    <input
                        type="text"
                        placeholder="Alterativt tekst for bilde"
                        name="altText"
                        onChange={handleChange}
                        value={formData.altText}
                    />

                    <input 
                        type="text"
                        placeholder="Bilde URL"
                        name="image"
                        onChange={handleChange}
                        value={formData.image}
                    />

                    <input
                        type="button"
                        name="siteSubmit"
                        value={currentOperation.operation}
                        onClick={handleSubmit}
                    />
                </Container>
            }

            {currentOperation.operation === "delete" && 
            <Button key="4" variant="primary" onClick={handleDelete} name="confirmDelete">Delete</Button>}
        
        </Container>
    )
}