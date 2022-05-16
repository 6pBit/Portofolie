import React from "react"
import { validate } from "react-email-validator"
import {Container, FormGroup, Form, Button, Col, Row, Modal} from "react-bootstrap"
import Bootstrap from "bootstrap"

export default function EditTab(props) {

  const isMounted = React.useRef(false)
  const idHelper = React.useRef("")

  const collection = "user"
  const dbFilter = "6254341b8acb5f014cfe0800"

  const [currentFile, setCurrentFile] = React.useState(null)
  const [activateEdit, setActivateEdit] = React.useState(false)
  const [requestReload, setRequestReload] = React.useState(false)
  const [requestUpdate, setRequestUpdate] = React.useState(false)

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
            return (event.target.files[0]) //fjerna return her  && event.target.files[0] !== null
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
        console.log(JSON.stringify(currentFile) + " dette er current file on submit")
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
            console.log(data.imageUrl + " dette skal være bilde urlen"),
           
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
              
              fetch(`/${collection}/editUser/${dbFilter}`, requestForDatabase)
              .then( response => {
                setCurrentFile(null)
                document.getElementById('fileInput').value = null
                setRequestReload(!requestReload)
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
    fetch(`/${collection}/editUser/${dbFilter}`, requestForDatabase )
      .then( response => {
        //console.log("fetch resultat etter post fra EditTabUser.js " + response.json())
        //setCurrentData(JSON.stringify(response.json()))
    })
  }

  function setData() {
    fetch(`/user/withId/6254341b8acb5f014cfe0800`) // ikke ha hardkodet brukerid her.
    .then(response => response.json()) 
    .then(data => (
      //console.log(data + " type objekt useEffect som getter bruker EditTabUser.js"),
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
      }else {
        updateUser()
      }
      setActivateEdit(!activateEdit)
      //setRequestReload(!requestReload)
    } else {
      isMounted.current = true
    }
  }, [requestUpdate])

  return (

      <Container>

          <div className="current_info">
              <article>
                  <p>Current firstname: {siteData.fornavn}</p>
                  <p>Current lastname: {siteData.etternavn}</p>
                  <p>Current tlfNumber: {siteData.tlfNummer}</p>
                  <p>Current email: {siteData.epost}</p>
                  <img id="userImage"
                      src={siteData.imageUrl}
                      alt={siteData.altText}
                      />
                  <p>Current alttekst: {siteData.altText}</p>
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
            {activateEdit && <Button key="5" variant="primary" name="userSubmit" value={"Edit"} onClick={handleSubmit}>Edit</Button>}
                
              
        </Form>

      </Container>

    )
}