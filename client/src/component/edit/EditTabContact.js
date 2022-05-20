import React from "react"
import {Container, Button, Modal, DropdownButton, Dropdown, ButtonGroup, Col, Row} from "react-bootstrap"
import { Form } from "react-bootstrap"
import {languages} from "../../strings/stringsEditTabContact.js"
import {IoLogoFacebook, IoLogoInstagram, IoLogoSnapchat, IoLogoTwitter, IoLogoLinkedin, IoLogoWechat} from "react-icons/io"
import {SiWechat} from "react-icons/si"

/**
 * 
 * @returns Container with content for EditTabContact
 */
export default function EditTabContact() {

    let keyForItems = 0
    const isMounted = React.useRef(false)
    const [currentLanguage, setCurrentLanguage] = React.useState("norwegian")
    const [tableContent, setTableContent] = React.useState([{name: ""}])
    const [stateShowCheckboxes, setStateShowCheckboxes] = React.useState(false)
    const [currentOperation, setCurrentOperation] = React.useState({operation: ""})
    const [currentMedia, setCurrentMedia] = React.useState({name: ""})
    const [supportedSome, setSupportedSome] = React.useState([
        "facebook", "snapchat", "instagram", "twitter", "linkedin", "tiktok", "wechat", "github"
    ])
    const [chosenSome, setChosenSome] = React.useState("")
    const [formData, setFormData] = React.useState({
        someName: "", 
        connectionUrl: ""
    })
    const [siteData, setSiteData] = React.useState({
        someName: "", 
        connectionUrl: ""
    })

    const [refresh, setRefresh] = React.useState(false)
    const [deleteArray, setDeleteArray] = React.useState([])
    const [showPopup, setShowPopup] = React.useState(false)
    const [wishToDelete, setWishToDelete] = React.useState(false)
    const [activateEdit, setActivateEdit] = React.useState(false)

    const [showAlert, setShowAlert] = React.useState(false)
    const [alertContent, setAlertContent] = React.useState("")

    React.useEffect(() => {
        updateList()
    }, [refresh])

    React.useEffect(() => {
        if(isMounted.current && currentMedia.name !== "") {
            handleGetSpesificSome()
        } else {}
    }, [currentMedia.name])

    React.useEffect(() => {
        if(isMounted.current) {
            deleteFromDatabase()
        } else {
            isMounted.current = true
        }
    }, [wishToDelete])


    function handleGetSpesificSome() {
        fetch(`/user/spesificSome/${currentMedia.name}`)
        .then(response => response.json())
        .then(data => (
            setSiteData( {
                someName: data.someName, 
                connectionUrl: data.connectionUrl
            }),

            setFormData({
                someName: data.someName, 
                connectionUrl: data.connectionUrl
            }) 
        ))
    }

    /**
     * Updates the lists which holds all some from the database
     */
    function updateList() {
        fetch("/user/someLinks")
        .then(response => response.json())
        .then(data => (
            setTableContent(data)
        ))
    }

    /**
     * Handles updating for insert some links to the database
     * based on currentOpreation state.
     */
    function handleUpdateorInsert() {
        let requestForDatabase = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({someName: formData.someName, connectionUrl: formData.connectionUrl})
        }

        fetch(`/user/${currentOperation.operation === "insert" ? "insertSome" : "update/" + currentMedia.name}`, requestForDatabase )
              .then( response => {
                if(currentOperation.operation === "insert") {
                    clean("formData")
                    clean("siteData")
                    clean("currentMedia")
                }
                clean("currentOperation")
                setRefresh(!refresh)
                handleAlert("Vellykket innsetting!")
          })
    }

    function handleSubmit(event) {
        event.preventDefault();
        if(formData.someName !== "" && currentOperation.operation !== "delete") {
            setSiteData({
                ...formData
            })
            handleUpdateorInsert()
            clean("chosenSome")
            clean("currentOperation")
            //setActivateEdit(!activateEdit)
        } 
    }

    function handleChange(event) {
        setFormData(prevFormData => {
            return({
                ...prevFormData,
                [event.target.name]: event.target.value
            })
        })
    }

    /**
     * Helper function which handles currently chosen media
     * @param {*} event 
     */
    function helper(event) {
        setCurrentMedia({
            name: event.target.name
        })
        setCurrentOperation({
            operation: "view"
        })
        setActivateEdit(false)
    }

    function handleItemClick(event) {
        setChosenSome(event.target.name)
        setFormData(prev => {
            return({
                ...prev,
                someName: event.target.name
            })
        })
    }

    /**
     * Helper function that helps clean sitedata for insert,
     * and setting the currentOpertion state.
     * @param {*} event 
     */
    function operationHelper(event) {
        if(event.target.name === "insert") {
           clean("siteData")
           clean("formData")
        }
        setCurrentOperation({operation: event.target.name})
        if(!activateEdit)
            setActivateEdit(!activateEdit)
    }

    function showCheckboxes() {
        setStateShowCheckboxes(!stateShowCheckboxes)
    }

    /**
     * Handles deletion
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

    /**
     * Function for deleting from mongodb database.
     */
    function deleteFromDatabase() {
        let requestForDatabase = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({someNames: deleteArray})
        }
        fetch("/user/deleteSeveral", requestForDatabase)
            .then(response => response.json())
            .then(data => {
                setDeleteArray([])
                showCheckboxes()
                clean("formData")
                clean("siteData")
                clean("currentMedia")
                updateList()
                handleAlert("Slettingen var vellykket!")
                setActivateEdit(!activateEdit)
            })
    }

    /**
     * Helper function tha cleans state based on input.
     * @param {*} dataToClean 
     */
    function clean(dataToClean) {
        if(dataToClean === "formData") {
            setFormData({
                someName: "",
                connectionUrl: ""
            })
        }

        if(dataToClean === "siteData") {
            setSiteData({
                someName: "",
                connectionUrl: ""
            })
        }

        if(dataToClean === "currentMedia") {
            setCurrentMedia({
                name: ""
            })
        }

        if(dataToClean === "chosenSome") {
            setChosenSome("")
        }
    }

    /**
     * Decides what logo to use based on the name of the social media.
     * @param {*} name 
     * @returns correct react-icon component
     */
    function decideSomeLogo(name) {
        let logo = null

        if(name === "facebook") logo = <IoLogoFacebook/>
        else if(name === "instagram") logo = <IoLogoInstagram/>
        else if(name === "twitter") logo = <IoLogoTwitter/>
        else if(name === "snapchat") logo = <IoLogoSnapchat/>
        else if(name === "wechat") logo = <SiWechat/>

        return logo
    }

    function handleClose() {
        setDeleteArray([])
        setShowPopup(!showPopup)
    }

    function handleAlert(content) {
        setAlertContent(content)
        setShowAlert(true)
        setTimeout(() => {
          setAlertContent("")
          setShowAlert(false)
        }, 3000)
      }


    return (
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
                        <h2>Er du sikker på at du ønsker å slette valgte elementer?</h2>
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

                <div class="d-flex justify-content-between">
                    <div class="me-1">
                        <Button
                            key="67" 
                            variant="primary" 
                            name="insert" 
                            onClick={operationHelper}
                        >Legg til sosialt media</Button>
                    </div>
                    <Button
                        key="68" 
                        variant="primary" 
                        name="mark" 
                        onClick={showCheckboxes}
                    >Marker</Button>
                    {stateShowCheckboxes && 
                        <div class="ms-1">
                            <Button
                                key="13" 
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
                    <th scope="col">{currentLanguage === "norwegian" ? languages.norwegian.descTableContent : "English bitches"}</th>
                </thead>
                <tbody>
                    {tableContent.map((media) => 
                        <tr>
                            <td scope="row">{decideSomeLogo(media.someName)}{media.someName}</td>
                            <td class="mr-0">
                                {<Button
                                    key="69" 
                                    variant="primary" 
                                    name={media.someName} 
                                    onClick={helper}
                                >Vis sosialt medie</Button>}
                            </td>
                            {stateShowCheckboxes &&
                                <td class="ml-1">
                                    <input class="form-check-input" type="checkbox" id="flexCheckDefault" value={media.someName}/>
                                </td>
                            }
                        </tr>
                    )}
                </tbody>
                <tfooter></tfooter>
            </table>

            {currentOperation.operation === "insert" &&
                <div className="mb-3">
                <Row>
                    <Col>
                        <Form>
                            <Form.Group as={Row} controlId="formGroupTitle">
                                    <Form.Label row sm={2}> Legg til en tilkoblingslenke</Form.Label>
                                    <Form.Control type="text" value={formData.connectionUrl} name="connectionUrl" onChange={handleChange} placeholder="Tilkoblings-URL" disabled={currentOperation.operation === "view"}/>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col>
                        <DropdownButton
                            as={ButtonGroup}
                            key={keyForItems+1}
                            id="dropdownBtn"
                            variant="primary"
                            title={chosenSome === "" ? "Choose social media" : chosenSome}
                        >
                            {supportedSome.map((some) => 
                                <Dropdown.Item eventKey={keyForItems+1} name={some} onClick={handleItemClick}>{some}</Dropdown.Item>
                            )}
                        </DropdownButton>
                    </Col>
                </Row>
                </div>
            }
            {(currentOperation.operation === "view" || currentOperation.operation === "update") && 
                <Container>
                    {currentOperation.operation !== "insert" &&

                        <div class="d-flex justify-content-end">
                            <Row>
                                <Button
                                    key="69" 
                                    variant="primary" 
                                    name="update"
                                    onClick={operationHelper}
                                >Aktiver redigering</Button>
                            </Row>
                        </div>
                    }
                    <Form className="mb-3">
                            <Form.Group as={Col} controlId="formGroupTitle">
                                <Form.Label row sm={2}>Tilkoblings-lenke</Form.Label>
                                <Form.Control as="textarea" value={formData.connectionUrl} name="connectionUrl" onChange={handleChange} placeholder="Tilkoblings-URL" disabled={!activateEdit}/>
                            </Form.Group>
                            
                    </Form>
                </Container>
            }
            {((currentOperation.operation === "update" || currentOperation.operation === "insert") && activateEdit) &&
                <Button key="5" variant="primary" name="siteSubmit" value={currentOperation.operation} onClick={handleSubmit}>{currentOperation.operation}</Button>
            }
        </Container>
    )
}