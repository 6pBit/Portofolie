import React from "react"
import { Form } from "react-bootstrap"
import { FormGroup } from "react-bootstrap"
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap"
import {Container, DropdownButton, ListGroup, Button, Col, Row} from "react-bootstrap"

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

    const [currentFile, setCurrentFile] = React.useState(null)
 
    const [formData, setFormData] = React.useState({
        title: "",
        description: "",
        altText: "",
        imageUrl: ""
        
    })
    
    const [siteData, setSiteData] = React.useState({
        title: "",
        description: "",
        altText: "",
        imageUrl: ""
        
    })

    const [listArray, setListArray] = React.useState([
        {
            title: ""
        }
    ])

    //Document blir noen ganger ikke oppdatert om man ikke også oppdaterer title på prosjektet
    React.useEffect(async () => {

        console.log("1 tabproject useffect ble kjørt")
        if(isMounted.current) {

            insertImage()

            //updateOrInsert()
            
          } else {}

          //Oppdaterer lista med prosjekter.
          updateList() 

    }, [wishToUpdate])

    React.useEffect(() => {
        console.log("2 tabproject useffect ble kjørt")
        if(isMounted.current && currentProject.title !== "") {
            fetch(`/projects/specific/${currentProject.title}`)
            .then(response => response.json())
            .then(data => (

                setSiteData( {
                    title: data.title,
                    description: data.description,
                    altText: data.altText,
                    imageUrl: data.imageUrl
                }),

                setFormData({
                    title: data.title,
                    description: data.description,
                    altText: data.altText,
                    imageUrl: data.imageUrl
                }) 

            ))
        } else {}

    }, [currentProject.title])
    
    React.useEffect(() => {
        console.log("3 tabproject useffect ble kjørt")
        if(isMounted.current && !(currentProject.title === "")) {

            const requestForDatabase = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({})
            }

            fetch(`/fileUpload/delete/image/${siteData.imageUrl}`)

            fetch(`/${collection}/delete/${currentProject.title}`, requestForDatabase )
            .then( response => {
                //console.log("resultat etter sletting fra Editproject.js " + response.json())
                console.log("resultat etter sletting fra Editproject.js " + response.json())
                clean("formData")
                clean("siteData")
                clean("currentProject")
                updateList()
            }) 
        } else {
            isMounted.current = true
        }
    }, [wishToDelete])

    function updateList() {
        fetch("/projects/titles")
        .then(response => response.json())
        .then(data => (
           //console.log(data + " data fra fetch editprojectstab"),
           setListArray(data)
        ))
    }

    function insertImage() {
        if(currentFile !== "" && currentFile !== null) {

            const imageData = new FormData()
            imageData.append("image", currentFile)

            const requestForLocalStorage = {
                method: 'POST',
                body: imageData
            }

            let requestForDatabase = {}

            fetch("/fileUpload/image", requestForLocalStorage)
            .then(response => response.json())
            .then(data => (
                console.log(data.imageUrl + " dette skal være bilde urlen"),
               
                requestForDatabase = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(
                        {
                            ...siteData,
                            imageUrl: data.imageUrl
                        }
                    )
                  },
                  
                  fetch(`/${collection}/${currentOperation.operation === "insert" ? "insert" : "update/" + currentProject.title}`, requestForDatabase )
                    .then( response => {
                        console.log("fetch resultat etter post fra Editproject.js " + response.json())
                        
                        if(currentOperation.operation === "insert") {
                            clean("formData")
                            clean("siteData")
                            clean("currentProject")
                            clean("currentFile")
                        }
                        clean("currentFile")
                        updateList()
                    })
            ))

            clean("currentFile")
            updateList()
            
        } else {
            updateOrInsert()
        }
    }


    function updateOrInsert() {
        console.log("Updateorinsert ble kjørt")
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
                if(currentOperation.operation === "insert") {
                    clean("formData")
                    clean("siteData")
                    clean("currentProject")
                    clean("currentFile")
                }
                clean("currentFile")
                updateList()
          })
    }

    function handleChange(event) {
        //console.log(event.target.value)
       
        if(event.target.name !== "imageFile") {
            setFormData(prevFormData => {
                return({
                    ...prevFormData,
                    [event.target.name]: event.target.value
                })
            })
        } else {
            setCurrentFile(() => {
                if((currentFile !== "" || currentFile !== null) && event.target.files[0] !== null) {
                    return (event.target.files[0]) //fjerna return her  && event.target.files[0] !== null
                }
            })
        }

    }

    function handleSubmit(event){
        event.preventDefault();
        if(formData.title !== "" && currentOperation.operation !== "delete") {
            setSiteData( {
                ...formData
            })
            //insertImage()
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
                                
                                updateList()
                                
        } else {
            console.log("Sletting avbrutt")
        }
    }

    function helper(event) {
        //console.log(event.target.name)
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
                imageUrl: ""
            })
        }

        if(dataToClean === "siteData") {
            setSiteData({
                title: "",
                description: "",
                altText: "",
                imageUrl: ""
            })
        }

        if(dataToClean === "currentProject") {
            setCurrentProject({
                title: ""
            })
        }

        if(dataToClean === "currentFile") {
            setCurrentFile("")
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
                                src={siteData.imageUrl}
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

                <Form className="mb-3">
                        <Form.Group as={Col} controlId="formGroupTitle">
                            <Form.Label column sm={2}>Tittel</Form.Label>
                            <Form.Control type="text" value={formData.title} name="title" onChange={handleChange} placeholder="Tittel for prosjektet"/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGroupTitle">
                            <Form.Label column sm={2}>Beskrivelse</Form.Label>
                            <Form.Control type="textarea" value={formData.description} name="description" onChange={handleChange} placeholder="Beskrivelse av prosjektet"/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGroupTitle">
                            <Form.Label column sm={2}>Alternativ tekst for bilde</Form.Label>
                            <Form.Control type="text" value={formData.altText} name="altText" onChange={handleChange} placeholder="Alternativ tekst for bilde"/>
                        </Form.Group>
                        <FormGroup as={Col} controlId="formGroupTitle">
                            <Form.Label column sm={2} ></Form.Label>
                            <Form.Control value={formData.imageUrl} name="imageUrl" onChange={handleChange} placeholder="Bildelenke"/>
                        </FormGroup>
                        <Form.Group as={Col} controlId="formGroupTitle">
                            <Form.Label column sm={2}>Bilde</Form.Label>
                            <Form.Control id="fileInput" type="file" accept=".pdf, .jpg, .jpeg" name="imageFile" onChange={handleChange} placeholder="Bilde"/>
                        </Form.Group>
                        <Button key="5" variant="primary" name="siteSubmit" value={currentOperation.operation} onClick={handleSubmit}>{currentOperation.operation}</Button>
                    </Form>
            }

            {currentOperation.operation === "delete" && 
            <Button key="4" variant="primary" onClick={handleDelete} name="confirmDelete">Delete</Button>}
        
        </Container>
    )
 
}
