import React from "react"
import { Container, Col, Button, Modal, Form} from "react-bootstrap"

export default function EditTabLanding(props) {

    const collection = "sites"
    const dbFilter = "landing"
    const isMounted = React.useRef(false)
    const [showAlert, setShowAlert] = React.useState(false)
    const [alertContent, setAlertContent] = React.useState("")
    const [refresh, setRefresh] = React.useState(false);
 
    const [siteData, setSiteData] = React.useState({
        title: "",
        introductionTxt: ""
    })
    const [formData, setFormData] = React.useState({
        title: "",
        introductionTxt: ""
    })
    
    function handleAlert(content) {
        console.log("heiiiiiii")
        setAlertContent(content)
        setShowAlert(true)
        setTimeout(() => {
          setAlertContent("")
          setShowAlert(false)
    }, 3000)}

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
        setSiteData( {
         ...formData
        })
        setRefresh(!refresh)
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
                //console.log("fetch resultat etter post fra Editlanding.js " + response.json())
                //setCurrentData(JSON.stringify(response.json()))
                handleAlert("Dette gikk bra gitt")
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
            
            <Form>
                <Form.Group as={Col} controlId="formGroupTitle">
                    <Form.Label>Overskrift</Form.Label>
                    <Form.Control type="text" name="title" placeholder="Denne teksten vises på toppen av siden" value={formData.title} onChange={handleChange}></Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="formGroupTitle">
                    <Form.Label>Introduksjonstekst</Form.Label>
                    <Form.Control as="textarea" rows={8} type="text" name="introductionTxt" placeholder="Introduksjonstekst for siden" value={formData.introductionTxt} onChange={handleChange}></Form.Control>
                </Form.Group>
            </Form>

            <Button onClick={handleSubmit}>Edit</Button>
            
        </Container>
    )

}