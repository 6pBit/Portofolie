import React from "react"
import { validate } from "react-email-validator"
import {Container, DropdownButton, ListGroup, Button, Col, Row} from "react-bootstrap"

export default function EditTab(props) {

  const isMounted = React.useRef(false)
  const idHelper = React.useRef("")

  const collection = "user"
  const dbFilter = "6254341b8acb5f014cfe0800"

    const [formData, setFormData] = React.useState({
        fornavn: "",
        etternavn: "",
        tlfNummer: "",
        epost: "",
        bildelenke: "",
        bildeAltTekst: ""
         // får se om det blir en lenke eller ikke.
    })
  
    const [oldData, setOldData] = React.useState({
        fornavn: "",
        etternavn: "",
        tlfNummer: "",
        epost: "",
        bildelenke: "",
        bildeAltTekst: ""
         // får se om det blir en lenke eller ikke.
    })

    function handleChange(event) {
        //console.log(event.target.value)

        setFormData(prevFormData => {
          return {
            ...prevFormData,
            [event.target.name]: event.target.value
          }
        })
    }

    function handleSubmit(event){
        event.preventDefault();
        
        if(validate(formData.epost) && formData.tlfNummer.length === 8) /* hardkoda :( */ {
          setOldData( {
            ...formData
          })
        } else {
          alert("Eposten eller telefonnummeret er ikke gyldig!")
        }
      
    }

    React.useEffect(() => {
      fetch(`/user/6254341b8acb5f014cfe0800`) 
      .then(response => response.json()) 
      .then(data => (
        //console.log(data + " type objekt useEffect som getter bruker EditTabUser.js"),
        idHelper.current = data._id,
        setOldData( {
          fornavn: data.fornavn,
          etternavn: data.etternavn,
          tlfNummer: data.tlfNummer,
          epost: data.epost,
          bildelenke: data.bildelenke, 
          bildeAltTekst: data.bildeAltTekst
        }, () => console.log(" Setstate kjørt Edittabuser.js")),
        setFormData({
          fornavn: data.fornavn,
          etternavn: data.etternavn,
          tlfNummer: data.tlfNummer,
          epost: data.epost,
          bildelenke: data.bildelenke, 
          bildeAltTekst: data.bildeAltTekst
        })
        )
      )
    }, [])

    React.useEffect(() => {
      if(isMounted.current) {
        const requestForDatabase = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(
            oldData
          )
        }
        fetch(`/${collection}/${dbFilter}`, requestForDatabase )
          .then( response => {
            //console.log("fetch resultat etter post fra EditTabUser.js " + response.json())
            //setCurrentData(JSON.stringify(response.json()))
        })
      } else {
        isMounted.current = true
      }
    }, [oldData])

    return (

        <Container>

            <div className="current_info">
                <article>
                    <p>Current firstname: {oldData.fornavn}</p>
                    <p>Current lastname: {oldData.etternavn}</p>
                    <p>Current tlfNumber: {oldData.tlfNummer}</p>
                    <p>Current email: {oldData.epost}</p>
                    <img src={oldData.bildelenke}
                        alt={oldData.bildeAltTekst}/>
                    <p>Current alttekst: {oldData.bildeAltTekst}</p>
                </article>
            </div>

          <form>
            <input 
              type="text" 
              placeholder="Fornavn"
              onChange={handleChange}
              name="fornavn"
              value={formData.fornavn}
            />
            <input
              type="text"
              placeholder="Etternavn"
              onChange={handleChange}
              name="etternavn"
              value={formData.etternavn}
            />
            <input
              type="text"
              placeholder="Telefonnummer"
              onChange={handleChange}
              name="tlfNummer"
              value={formData.tlfNummer}
            />
            <input
              type="email"
              placeholder="Epost"
              onChange={handleChange}
              name="epost"
              value={formData.epost}
            />
            <input
              type="text"
              placeholder="Bildelenke"
              onChange={handleChange}
              name="bildelenke"
              value={formData.bildelenke}
            />
            <input
              type="text"
              placeholder="Bilde alt tekst"
              onChange={handleChange}
              name="bildeAltTekst"
              value={formData.bildeAltTekst}
            />

            <input
              type="button"
              name="userSubmit"
              onClick={handleSubmit}
            />

          </form>


        </Container>


    )
}