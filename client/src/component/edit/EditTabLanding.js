import React from "react"
import { Container, Col, Button, Modal, Form} from "react-bootstrap"

/**
 * @returns Container with content for EditTabLanding
 */

export default function EditTabLanding() {

    const collection = "sites"
    const dbFilter = "landing"
    const isMounted = React.useRef(false)
    const [showAlert, setShowAlert] = React.useState(false)
    const [alertContent, setAlertContent] = React.useState("")
    const [refresh, setRefresh] = React.useState(false)
    const [activateEdit, setActivateEdit] = React.useState(false)
    const [siteData, setSiteData] = React.useState({
        title: "",
        introductionTxt: ""
    })
    const [formData, setFormData] = React.useState({
        title: "",
        introductionTxt: ""
    })
    
    function handleAlert(content) {
        setAlertContent(content)
        setShowAlert(true)
        setTimeout(() => {
          setAlertContent("")
          setShowAlert(false)
    }, 3000)}

    function handleChange(event) {
        setFormData(prevFormData => {
          return {
            ...prevFormData,
            [event.target.name]: event.target.value
          }
        })
    }

    function handleSubmit(event){
        event.preventDefault();
        setSiteData( {
         ...formData
        })
        setRefresh(!refresh)
        setActivateEdit(!activateEdit)
    }

    function handleClick() {
        setActivateEdit(!activateEdit)
    }

    React.useEffect(() => {
        fetch("/sites/landing")
        .then(response => response.json())
        .then(data => (
            setFormData( {
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
                siteData
              )
            }
            fetch(`/${collection}/${dbFilter}`, requestForDatabase )
              .then( response => {
                handleAlert("Oppdateringen var vellykket!")
            })
          } else {
            isMounted.current = true
          }
    }, [refresh])

    return(
        <Container>

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

            <div class="d-flex justify-content-end">
                <Button
                    key="69" 
                    variant="primary" 
                    name="edit"
                    onClick={handleClick}
                >Activate Editing</Button>
            </div>
            
            <Form className="mb-3">
                <Form.Group as={Col} controlId="formGroupTitle">
                    <Form.Label>Overskrift</Form.Label>
                    <Form.Control type="text" name="title" placeholder="Denne teksten vises på toppen av siden" value={formData.title} onChange={handleChange} disabled={!activateEdit}></Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="formGroupTitle">
                    <Form.Label>Introduksjonstekst</Form.Label>
                    <Form.Control as="textarea" rows={8} type="text" name="introductionTxt" placeholder="Introduksjonstekst for siden" value={formData.introductionTxt} onChange={handleChange} disabled={!activateEdit}></Form.Control>
                </Form.Group>
            </Form>

            {activateEdit && <div class="d-flex justify-content-end"><Button onClick={handleSubmit}>Edit</Button> </div>}
            
        </Container>
    )
}