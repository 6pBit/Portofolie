import React from "react"
import {Container, FormGroup, Form, Button, Col, Row, Modal, CloseButton} from "react-bootstrap"
import ProjectCard from "../main/ProjectCard"

export default function EditTabProject(props) {

    const collection = "projects"
    const dbFilter = "mitt_forst"
    const isMounted = React.useRef(false)

    //States som skal trigge useEffect
    const [triggerReRender, setTriggerReRender] = React.useState(false)
    const [wishToDelete, setWishToDelete] = React.useState(false)
    const [wishToUpdate, setWishToUpdate] = React.useState(false)
    //-----------------------------------------------------------------
    //States for toggle av komponenter
    const [stateShowCheckboxes, setStateShowCheckboxes] = React.useState(false)
    const [showPopup, setShowPopup] = React.useState(false)
    const [showTimedModal, setShowTimedModal] = React.useState(false)
    //-----------------------------------------------------------------
    //States som holder på data
    const [currentProject, setCurrentProject] = React.useState({title: ""})
    const [currentFile, setCurrentFile] = React.useState(null)
    const [formData, setFormData] = React.useState({
        title: "",
        description: "",
        projectUrl: "",
        altText: "",
        imageUrl: ""
    })
    const [siteData, setSiteData] = React.useState({
        title: "",
        description: "",
        projectUrl: "",
        altText: "",
        imageUrl: ""
    })
    const [tableContent, setTableContent] = React.useState([{title: ""}])
    const [currentOperation, setCurrentOperation] = React.useState({operation: ""})
    const [deleteArray, setDeleteArray] = React.useState([])
    //-------------------------------------------------------------------
    //Document blir noen ganger ikke oppdatert om man ikke også oppdaterer title på prosjektet
    React.useEffect(() => { //fjernet async her

        //console.log("1 tabproject useffect ble kjørt")
        if(isMounted.current) {

            if(document.getElementById('fileInput').value !== null)
                insertImage()
            else
                updateOrInsert()
            
          }

          updateList() 

    }, [wishToUpdate])

    //useEffect for å oppdatere currentProject, og også for å oppdatere siteData om noe slettes
    //slik at ikke gammel data vises på siden.
    React.useEffect(() => {
        //console.log("2 tabproject useffect ble kjørt")
        if(isMounted.current && currentProject.title !== "") {
            fetch(`/projects/specific/${currentProject.title}`)
            .then(response => response.json())
            .then(data => (

                setSiteData( {
                    title: data.title,
                    description: data.description,
                    projectUrl: data.projectUrl,
                    altText: data.altText,
                    imageUrl: data.imageUrl
                }),

                setFormData({
                    title: data.title,
                    description: data.description,
                    projectUrl: data.projectUrl,
                    altText: data.altText,
                    imageUrl: data.imageUrl
                }) 

            ))
        } else {}

    }, [currentProject.title, triggerReRender])
    
    //useEffect som trigges for å gjennomføre sletting mot databasen og server,
    //og trigger rerender av siden.
    React.useEffect(() => {
        //console.log("3 tabproject useffect ble kjørt")
        if(isMounted.current) {

            let temp = deleteArray.map((title) => {
                return(
                    title + ""
                )
            })
     
            let inputString = temp.toString().replaceAll(',', '+')
            let requestForDatabase = {}
            console.log(inputString + " før den blir send til imagestodelete")
            fetch(`/projects/imagesToDelete/${inputString}`)
            .then(response => response.json())
            .then(data => {
                 //temp = data
                 //console.log(JSON.stringify(data + " data fra imagesToDelete og puttes inn i fileopload delete images"))
                 requestForDatabase = {
                     method: 'POST',
                     headers: {'Content-Type': 'application/json'},
                     body: JSON.stringify({filePaths: [data]})
                }
                 
                //console.log(JSON.stringify(tempArray + " tempArray fra imagesToDelete og puttes inn i fileopload delete images"))
                fetch("/fileUpload/delete/fromAws", requestForDatabase)
                .then(response => response.json())
                .then(data => {
                    console.log("Ferdig med lokal bildesletting")
         
                     console.log(" data etter lokal sletting av bilder")
                     //flytt alt under ut, så virker sletting.
                    
                })
     
                 //console.log("Her er delteArray på clientsiden: " + JSON.stringify(deleteArray))
                requestForDatabase = {
                     method: 'POST',
                     headers: {'Content-Type': 'application/json'},
                     body: JSON.stringify({titles: deleteArray})
                }
     
                fetch("/projects/deleteSeveral", requestForDatabase)
                .then(response => response.json())
                .then(data => {
                    //data.map(project => console.log(project.title + " ble slettet fra databasen"))
                    setDeleteArray([])
                    //setShowPopup(!showPopup)
                    showCheckboxes()

                    //fra gammel delete
                    clean("formData")
                    clean("siteData")
                    clean("currentProject")
                    updateList()

                })
     
             })
         
        } else {
            isMounted.current = true
        }
    }, [wishToDelete])

    //Oppdaterer state som holder på alle prosjekter fra databasen.
    function updateList() {
        fetch("/projects/titles")
        .then(response => response.json())
        .then(data => (
           //console.log(data + " data fra fetch editprojectstab"),
           setTableContent(data)
        ))
    }

    //Laster opp bilde til server om bildet er en fil.
    function insertImage() {
        if(currentFile !== "" && currentFile !== null) {
            //console.log("Insert image kjørt")
            /*
            console.log(document.getElementById('fileInput').files[0] + " her er fila før den sendes til getsigned")
            if(document.getElementById('fileInput').files[0] !== null)
                getSignedRequest(document.getElementById('fileInput').files[0])
            //getSignedRequest(encodeURIComponent(document.getElementById('fileInput').files[0]))
            //getSignedRequest(currentFile)
            */
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
                            clean("currentFile")
                            updateList()
                            clean("currentProject")
                        }
                        clean("currentFile")
                        document.getElementById('fileInput').value = null
                        updateList()
                        setTriggerReRender(!triggerReRender)
                    })
            ))

            clean("currentFile")
            updateList()
            
        } else {
            updateOrInsert()
        }
    }

    //Oppdaterer eller inserter mot databasen og server basert på 
    //currentOperation state.
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
                setCurrentOperation({
                    operation: "view"
                })
                setTriggerReRender(!triggerReRender)
                //timeOut()
          })
    }

    //Håndterer forandringer i input feltene, og om det har blitt valgt en fil
    //som skal lastes opp.
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
                if((currentFile == "" || currentFile == null) && event.target.files[event.target.files.length-1] !== null && event.target.files[event.target.files.length-1] !== "") {
                    console.log("currentfile oppdatert")
                    return (event.target.files[0]) //fjerna return her  && event.target.files[0] !== null
                }
               
            })
             //evt querySelector
        }

    }

    //Håndterer submit, og setter igang insert eller update 
    function handleSubmit(event){
        event.preventDefault();
        if(formData.title !== "" && currentOperation.operation !== "delete") {
            setSiteData( {
                ...formData
            })
            //insertImage()
            console.log(JSON.stringify(currentFile) + " dette er current file on submit")
            setWishToUpdate(!wishToUpdate)
            updateList()
            /*
            setCurrentOperation({
                operation: "view"
            })
            */
        } 
    }
    //Håndterer og setter igang sletting
    function handleDelete(event) {
        
        if(event.target.name === "modalDelete") {
            //fiks løsning
            const all = document.querySelectorAll('input[type=checkbox]:checked')
            let tempList = []
            for(let i=0; i<all.length; i++) {// kanskje legge til en forEach her istedenfor
                tempList.push(all[i].value)
            }
            setDeleteArray(tempList)
            //console.log("Her er alle titlene fra bokser som var valgt ved sletting")
            
            setShowPopup(!showPopup)
                
            deleteArray.map(item => console.log("Tittel fra deleteArray:" + item.title))
            console.log("Delete button pressed")
            setWishToDelete(!wishToDelete)
            setCurrentOperation({
                operation: "delete"
            })
        }  else {
            setShowPopup(!showPopup)
        }
        
        //bør renske currentProject men noe rart med den
        //Om den ikke fjernes blir man spurt om man vil slette den samme på nytt               
        //updateList()//overflødig?              
    }

    //Endrer state
    function showCheckboxes() {
        //console.log("marker for sletting pressed")
        setStateShowCheckboxes(!stateShowCheckboxes)
    }

    //Handler for lukking av Modal component
    function handleClose() {
        setDeleteArray([])
        setShowPopup(!showPopup)
    }

    //helper funksjon som setter nåværende valgt prosjekt.
    function helper(event) {
        //console.log(event.target.name)
        setCurrentProject({
            title: event.target.name
        })
        setCurrentOperation({
            operation: "view"
        })   
    }

    //helper funksjon som setter nåværende operasjon
    function operationHelper(event) {
        if(event.target.name === "insert") {
            clean("formData")
            clean("siteData")
        }
        setCurrentOperation({
            operation: event.target.name
        })
    }

    //Viser Modal med melding om vellykket sletting, endring eller insert,
    //og fjerner den etter 3 sekunder. (3000 millisek). Må prøves ut.
    function timeOut() {
        setShowTimedModal(!showTimedModal)
        const timeOut = setTimeout(() => {
            setShowTimedModal(!showTimedModal)
        }, 3000)
        return () => {
            clearTimeout(timeOut)
        }
    }

    //Hjelpefunksjon som rensker valgt state for innhold.
    function clean(dataToClean) {
        if(dataToClean === "formData") {
            setFormData({
                title: "",
                description: "",
                projectUrl: "",
                altText: "",
                imageUrl: ""
            })
        }

        if(dataToClean === "siteData") {
            setSiteData({
                title: "",
                description: "",
                projectUrl: "",
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
            setCurrentFile(null)
        }

    } 

    return(
        <Container>

            {deleteArray != null && 
                <Modal
                    show={showPopup}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header>
                        <Modal.Title>Sletting</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h2>Du er iferd med å slette følgende prosjekter:</h2>
                        {deleteArray.map(project => {
                            <p>{project.title}</p>
                        })}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Lukk</Button>
                        <Button variant="primary" name="modalDelete" onClick={handleDelete}>Slett</Button>
                    </Modal.Footer>
                </Modal>
            }

            <div class="options d-flex justify-content-end">

                <div class="mr-0 d-flex justify-content-between">
                    <div class="me-1">
                        <Button
                            
                            key="5" 
                            variant="primary" 
                            name="insert" 
                            onClick={operationHelper}
                        >Add new project</Button>
                    </div>
                    <Button
                        key="5" 
                        variant="primary" 
                        name="mark" 
                        onClick={showCheckboxes}
                    >Mark</Button>
                    {stateShowCheckboxes &&
                        <div class="ms-1"> 
                        <Button
                            key="6" 
                            variant="danger" 
                            name="siteDelete" 
                            disabled={!stateShowCheckboxes}
                            onClick={handleDelete}
                        >Delete</Button>
                        </div>
                    }
                    
                </div>
                
            </div>
            
            <table class="table table-sm table-hover caption-top table-bordered">
                
                <thead class="table-light">
                    <th scope="col">Prosjektnavn</th>
                </thead>
                <tbody>
                    {tableContent.map((project) => 
                        <tr>
                            <td scope="row">{project.title}</td>
                            <td class="mr-0">
                                {<Button
                                    key="69" 
                                    variant="primary" 
                                    name={project.title} 
                                    onClick={helper}
                                >Vis prosjekt</Button>}
                            </td>
                            {stateShowCheckboxes &&
                                <td class="ml-1">
                                    <input class="form-check-input" type="checkbox" name={project.title} value={project.title} id="flexCheckDefault"/>
                                </td>
                            }
                        </tr>
                    )}
                </tbody>
                <tfooter></tfooter>
            </table>

            { !(currentOperation.operation === "insert" || currentOperation.operation === "delete" || currentOperation.operation === "" || currentProject.title === "") && 
                
                <Container className="justify-content-center" style={{display: 'flex'}}>
                    <Col>
                        <h2>Preview of ProjectCard</h2>
                        <Row>
                            <ProjectCard 
                                id="card"            
                                title={siteData.title}
                                image={siteData.imageUrl}
                                altText={siteData.altText}
                                description={siteData.description}
                                projectUrl={siteData.projectUrl}
                            />
                        </Row>
                    </Col>
                </Container>
            }

            {(currentOperation.operation === "edit" || currentOperation.operation === "insert" || currentOperation.operation === "view") &&
                <Container>
                    {currentOperation.operation !== "insert" &&
                        <Row>
                            <Button
                                key="69" 
                                variant="primary" 
                                name="edit"
                                onClick={operationHelper}
                            >Activate Editing</Button>
                        </Row>
                    }
                    
                    <Form className="mb-3">
                            <Form.Group as={Col} controlId="formGroupTitle">
                                <Form.Label column sm={2}>Tittel</Form.Label>
                                <Form.Control type="text" value={formData.title} name="title" onChange={handleChange} placeholder="Tittel for prosjektet" disabled={currentOperation.operation === "view"}/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGroupTitle">
                                <Form.Label column sm={2}>Beskrivelse</Form.Label>
                                <Form.Control as="textarea" rows={3} type="text" value={formData.description} name="description" onChange={handleChange} placeholder="Beskrivelse av prosjektet" disabled={currentOperation.operation === "view"}/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGroupTitle"> 
                                <Form.Label row sm={2}>Lenke til eksternt prosjekt</Form.Label>
                                <Form.Control type="text" value={formData.projectUrl} name="projectUrl" onChange={handleChange} placeholder="Lenke til eksternt prosjekt" disabled={currentOperation.operation === "view"}/>
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGroupTitle">
                                <Form.Label row sm={2}>Alternativ tekst for bilde</Form.Label>
                                <Form.Control type="text" value={formData.altText} name="altText" onChange={handleChange} placeholder="Alternativ tekst for bilde" disabled={currentOperation.operation === "view"}/>
                            </Form.Group>
                            <FormGroup as={Col} controlId="formGroupTitle">
                                <Form.Label column sm={2}>Bildelenke</Form.Label>
                                <Form.Control value={formData.imageUrl} name="imageUrl" onChange={handleChange} placeholder="Bildelenke" disabled={currentOperation.operation === "view"}/>
                            </FormGroup>
                            {currentOperation.operation !== "view" &&
                                <Form.Group as={Col} controlId="formGroupTitle">
                                    <Form.Label column sm={2}>Bilde</Form.Label>
                                    <Form.Control id="fileInput" type="file" accept=".png, .jpg, .jpeg" name="imageFile" onChange={handleChange} placeholder="Bilde"/>
                                </Form.Group>
                            }
                            {(currentOperation.operation === "edit" || currentOperation.operation === "insert" && currentOperation.operation !== "delete") &&
                                <Button key="5" variant="primary" name="siteSubmit" value={currentOperation.operation} onClick={handleSubmit}>{currentOperation.operation}</Button>
                            }
                    </Form>
                </Container>
            }
        
        </Container>
    )
 
}

/**
 * <Modal
                id="timedModal"
                size="sm"
                show={!showTimedModal}
            >
                <Modal.Header CloseButton>
                    <p>{currentOperation.operation} was successful! :D</p>
                </Modal.Header>
                <Modal.Body>
                    {}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Lukk</Button>
                </Modal.Footer>
            </Modal>
 * 
 * 
 * 
 */