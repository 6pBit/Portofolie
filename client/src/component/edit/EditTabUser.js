import React from "react"
import { validate } from "react-email-validator"
import {Container, FormGroup, Form, Button, Col, Modal} from "react-bootstrap"

/**
 * @returns Container with content for EditTabUser
 */
export default function EditTab() {

  const isMounted = React.useRef(false)
  const idHelper = React.useRef("")
  const collection = "user"
  const [currentFile, setCurrentFile] = React.useState(null)
  const [activateEdit, setActivateEdit] = React.useState(false)
  const [requestReload, setRequestReload] = React.useState(false)
  const [requestUpdate, setRequestUpdate] = React.useState(false)
  const [showAlert, setShowAlert] = React.useState(false)
  const [alertContent, setAlertContent] = React.useState("")

  const [formData, setFormData] = React.useState({
      fornavn: "",
      etternavn: "",
      tlfNummer: "",
      epost: "",
      imageUrl: "",
      altText: ""
  })

  const [siteData, setSiteData] = React.useState({
      fornavn: "",
      etternavn: "",
      tlfNummer: "",
      epost: "",
      imageUrl: "",
      altText: ""
  })

  function handleClick() {
    setActivateEdit(!activateEdit)
  }

  function handleChange(event) {
    if(event.target.name !== "imageFile") {
      setFormData(prevFormData => {
        return {
          ...prevFormData,
          [event.target.name]: event.target.value
        }
      })
    } else {
      setCurrentFile(() => {
        if((currentFile === "" || currentFile === null) && event.target.files[event.target.files.length-1] !== null && event.target.files[event.target.files.length-1] !== "") {
            console.log("currentfile oppdatert")
            return (event.target.files[0])
        }
      })
    }
  }

  function handleSubmit(event){
      event.preventDefault();
      if(validate(formData.epost) && formData.tlfNummer.length === 8) /* hardkoda :( */ {
        setSiteData( {
          ...formData
        })
        setRequestUpdate(!requestUpdate)
      } else {
        alert("Eposten eller telefonnummeret er ikke gyldig!")
      }
  }

  function updateWithImageFile() {
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
                        bildelenke: data.imageUrl
                    }
                )
              },
              
              fetch(`/${collection}/editUser`, requestForDatabase)
              .then( response => {
                setCurrentFile(null)
                document.getElementById('fileInput').value = null
                setRequestReload(!requestReload)
                handleAlert("Oppdateringen var vellykket!")
              })
                
        ))
    } 
  }

  function updateUser() {
    const requestForDatabase = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(
        siteData
      )
    }
    fetch(`/${collection}/editUser`, requestForDatabase )
      .then(response => response.json())
      .then(data => {
        handleAlert("Oppdateringen var vellykket!")
      })
  }

  function setData() {
    fetch(`/user/withId`)
    .then(response => response.json()) 
    .then(data => (
      idHelper.current = data._id,
      setSiteData( {
        fornavn: data.fornavn,
        etternavn: data.etternavn,
        tlfNummer: data.tlfNummer,
        epost: data.epost,
        imageUrl: data.bildelenke, 
        altText: data.bildeAltTekst
      }),
      setFormData({
        fornavn: data.fornavn,
        etternavn: data.etternavn,
        tlfNummer: data.tlfNummer,
        epost: data.epost,
        imageUrl: data.bildelenke, 
        altText: data.bildeAltTekst
      })
    ))}

  React.useEffect(() => {
      setData()
  }, [requestReload])

  React.useEffect(() => {
    if(isMounted.current) {

      if(currentFile !== null) {
        updateWithImageFile()
      } else {
        updateUser()
      }
      setActivateEdit(!activateEdit)
    } else {
      isMounted.current = true
    }
  }, [requestUpdate])

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
          <div className="sidebar-header">
              <article>
                  <img id="userImage"
                      src={siteData.imageUrl}
                      alt={siteData.altText}
                      />
              </article>
          </div>
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
                <Form.Label column sm={2}>Fornavn</Form.Label>
                <Form.Control type="text" value={formData.fornavn} name="fornavn" onChange={handleChange} placeholder="Tittel for prosjektet" disabled={!activateEdit}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGroupTitle">
                <Form.Label column sm={2}>Etternavn</Form.Label>
                <Form.Control as="textarea" rows={3} type="text" value={formData.etternavn} name="etternavn" onChange={handleChange} placeholder="Beskrivelse av prosjektet" disabled={!activateEdit}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGroupTitle">
                <Form.Label column sm={2}>Telefonnummer</Form.Label>
                <Form.Control as="textarea" rows={3} type="text" value={formData.tlfNummer} name="tlfNummer" onChange={handleChange} placeholder="Beskrivelse av prosjektet" disabled={!activateEdit}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGroupTitle">
                <Form.Label column sm={2}>Epost</Form.Label>
                <Form.Control rows={3} type="email" value={formData.epost} name="epost" onChange={handleChange} placeholder="Beskrivelse av prosjektet" disabled={!activateEdit}/>
            </Form.Group>
            <Form.Group as={Col} controlId="formGroupTitle">
                <Form.Label column sm={2}>Alternativ tekst for bilde</Form.Label>
                <Form.Control type="text" value={formData.altText} name="altText" onChange={handleChange} placeholder="Alternativ tekst for bilde" disabled={!activateEdit}/>
            </Form.Group>
            <FormGroup as={Col} controlId="formGroupTitle">
                <Form.Label column sm={2}>Bildelenke</Form.Label>
                <Form.Control value={formData.imageUrl} name="imageUrl" onChange={handleChange} placeholder="Bildelenke" disabled={!activateEdit}/>
            </FormGroup>
            {activateEdit && 
              <Form.Group as={Col} controlId="formGroupTitle">
                  <Form.Label column sm={2}>Bilde</Form.Label>
                  <Form.Control id="fileInput" type="file" accept=".png, .jpg, .jpeg" name="imageFile" onChange={handleChange} placeholder="Bilde"/>
              </Form.Group>
            }
            {activateEdit && <div class="d-flex justify-content-end"><Button key="5" variant="primary" name="userSubmit" value={"Edit"} onClick={handleSubmit}>Edit</Button> </div>}
        </Form>

      </Container>
    )
}