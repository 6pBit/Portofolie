import React from "react"
import {Container, FormGroup, Form, Button, Col, Row, Modal, CloseButton} from "react-bootstrap"
import ProjectCard from "../main/ProjectCard"

/** 
 * @returns Container with content for EditTabProject
 */

export default function EditTabProject() {

    const collection = "projects"
    const isMounted = React.useRef(false)

    const [triggerReRender, setTriggerReRender] = React.useState(false)
    const [wishToDelete, setWishToDelete] = React.useState(false)
    const [wishToUpdate, setWishToUpdate] = React.useState(false)
    //-----------------------------------------------------------------

    const [stateShowCheckboxes, setStateShowCheckboxes] = React.useState(false)
    const [showPopup, setShowPopup] = React.useState(false)
    const [activateEdit, setActivateEdit] = React.useState(false)
    //-----------------------------------------------------------------
    
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
    const [showAlert, setShowAlert] = React.useState(false)
    const [alertContent, setAlertContent] = React.useState("")
    //-------------------------------------------------------------------

    React.useEffect(() => {
        if(isMounted.current) {
            if(document.getElementById('fileInput').value !== null)
                insertImage()
            else
                updateOrInsert()
        } else {
            updateList() 
        }
        
    }, [wishToUpdate])

    React.useEffect(() => {
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
        }

    }, [currentProject.title, triggerReRender])
    
    React.useEffect(() => {
        if(isMounted.current) {

            let temp = deleteArray.map((title) => {
                return(
                    title + ""
                )
            })
     
            let inputString = temp.toString().replaceAll(',', '+')
            let requestForDatabase = {}
            fetch(`/projects/imagesToDelete/${inputString}`)
            .then(response => response.json())
            .then(data => {
                 
                 requestForDatabase = {
                     method: 'POST',
                     headers: {'Content-Type': 'application/json'},
                     body: JSON.stringify({filePaths: [data]})
                }
                 
                fetch("/fileUpload/delete/fromAws", requestForDatabase)
                .then(response => response.json())
                .then(data => {})
     
                requestForDatabase = {
                     method: 'POST',
                     headers: {'Content-Type': 'application/json'},
                     body: JSON.stringify({titles: deleteArray})
                }
     
                fetch("/projects/deleteSeveral", requestForDatabase)
                .then(response => response.json())
                .then(data => {
                    setDeleteArray([])
                    showCheckboxes()
                    clean("formData")
                    clean("siteData")
                    clean("currentProject")
                    updateList()
                    handleAlert("Slettingen var vellykket!")
                })
     
             })
         
        } else {
            isMounted.current = true
        }
    }, [wishToDelete])

    /**
     * Updates the state which holds all projects from the database
     */
    function updateList() {
        fetch("/projects/titles")
        .then(response => response.json())
        .then(data => (
           setTableContent(data)
        ))
    }

    /**
     * Inserts imagefile to AWS S3 and uploads image url to mongodb
     */
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
                        
                        if(currentOperation.operation === "insert") {
                            clean("formData")
                            clean("siteData")
                            clean("currentFile")
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

    /**
     * Updates or inserts to mongodb based on currentOperation state
     */
    function updateOrInsert() {
        const requestForDatabase = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                siteData
            )
          }
          
          fetch(`/${collection}/${currentOperation.operation === "insert" ? "insert" : "update/" + currentProject.title}`, requestForDatabase )
              .then( response => {
                if(currentOperation.operation === "insert") {
                    clean("formData")
                    clean("siteData")
                    clean("currentProject")
                    clean("currentFile")
                }
                clean("currentFile")
                if(currentOperation.operation === "insert") {
                    handleAlert("Vellykket innsetting")
                }
                if(currentOperation.operation === "update") {
                    handleAlert("Oppdatering vellykket!")
                }
                clean("currentOperation")
                updateList()
                setTriggerReRender(!triggerReRender)
          })
    }

    /**
     * @param {*} event 
     * Handles changes in the input fields, and if a file has been chosen for upload
     */
    function handleChange(event) {
       
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
                    return (event.target.files[0])
                }
            })
        }
    }

    /**
     * Handles submit and triggers insert or update
     * @param {*} event 
     */
    function handleSubmit(event){
        event.preventDefault();
        if(formData.title !== "" && currentOperation.operation !== "delete") {
            setSiteData( {
                ...formData
            })
            console.log("Handle submit kjørt wishtoupdate")
            setWishToUpdate(!wishToUpdate)
        } 
    }

    /**
     * Handels deletion of projects
     * @param {*} event 
     */
    function handleDelete(event) {
        
        if(event.target.name === "modalDelete") {
            
            const all = document.querySelectorAll('input[type=checkbox]:checked')
            let tempList = []
            for(let i=0; i<all.length; i++) {
                tempList.push(all[i].value)
            }
            setDeleteArray(tempList)
            
            setShowPopup(!showPopup)

            setWishToDelete(!wishToDelete)
            setCurrentOperation({
                operation: "delete"
            })
        }  else {
            setShowPopup(!showPopup)
        }
                  
    }

    function showCheckboxes() {
        setStateShowCheckboxes(!stateShowCheckboxes)
        setCurrentOperation({
            operation: "delete"
        })
    }

    /**
     * Handles closing of the modal component
     */
    function handleClose() {
        setDeleteArray([])
        setShowPopup(!showPopup)
    }

    /**
     * Helper function which sets currently chosen project
     * @param {*} event 
     */
    function helper(event) {
        setCurrentProject({
            title: event.target.name
        })
        setCurrentOperation({
            operation: "view"
        })   
    }

    /**
     * Function that sets current operation
     * @param {*} event 
     */
    function operationHelper(event) {
        if(event.target.name === "insert") {
            clean("formData")
            clean("siteData")
        }
        setCurrentOperation({
            operation: event.target.name
        })

    }

    function handleAlert(content) {
        setAlertContent(content)
        setShowAlert(true)
        setTimeout(() => {
          setAlertContent("")
          setShowAlert(false)
        }, 3000)
      }

    /**
     * Helper function which cleans data fram given state
     * @param {*} dataToClean 
     */
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
                        <h2>Er du sikker på at du ønsker å slette de valgte prosjektene?</h2>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Lukk</Button>
                        <Button variant="primary" name="modalDelete" onClick={handleDelete}>Slett</Button>
                    </Modal.Footer>
                </Modal>
            }

        {showAlert &&
            <Modal 
                show={showAlert}
                backdrop="static"
                keyboard={false}>
            <Modal.Header>Tilbakemelding</Modal.Header>
            <Modal.Body>
                <p className="mb-0">{alertContent}</p>
                <hr/>
            </Modal.Body>
            </Modal>
        }

            <div class="options d-flex justify-content-end">

                <div class="mr-0 d-flex justify-content-between">
                    <div class="me-1">
                        <Button
                            key="10" 
                            variant="primary" 
                            name="insert" 
                            onClick={operationHelper}
                        >Legg til nytt prosjekt</Button>
                    </div>
                    <Button
                        key="81" 
                        variant="primary" 
                        name="mark" 
                        onClick={showCheckboxes}
                    >Marker</Button>
                    {stateShowCheckboxes &&
                        <div class="ms-1"> 
                            <Button
                                key="31" 
                                variant="danger" 
                                name="siteDelete" 
                                disabled={!stateShowCheckboxes}
                                onClick={handleDelete}
                            >Slett</Button>
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
                        <h2>Forhåndsvisning av Prosjektkort</h2>
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
                        <div class="d-flex justify-content-end">
                            <Button
                                key="69" 
                                variant="primary" 
                                name="edit"
                                onClick={operationHelper}
                            >Activate Editing</Button>
                        </div>
                    }
                    
                    <Form className="mb-3">
                            <Form.Group as={Col} controlId="formGroupTitle">
                                <Form.Label column sm={2}>Tittel</Form.Label>
                                <Form.Control type="text" value={formData.title} name="title" onChange={handleChange} placeholder="Tittel for prosjektet" disabled={(currentOperation.operation === "view" || currentOperation.operation === "edit")}/>
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
                            {(currentOperation.operation !== "view" && activateEdit) &&
                                <Form.Group as={Col} controlId="formGroupTitle">
                                    <Form.Label column sm={2}>Bilde</Form.Label>
                                    <Form.Control id="fileInput" type="file" accept=".png, .jpg, .jpeg" name="imageFile" onChange={handleChange} placeholder="Bilde"/>
                                </Form.Group>
                            }
                            
                    </Form>
                    {(currentOperation.operation === "edit" || currentOperation.operation === "insert" && currentOperation.operation !== "delete") &&
                        <div className="">
                            <div class="d-flex justify-content-end"><Button key="65" variant="primary" name="siteSubmit" value={currentOperation.operation} onClick={handleSubmit}>{currentOperation.operation}</Button></div>
                        </div>
                    }
                </Container>
            }
        </Container>
    )
}