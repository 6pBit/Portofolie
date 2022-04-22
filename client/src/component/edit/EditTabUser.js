import React from "react"
import {Container} from "react-bootstrap"

export default function EditTab(props) {


    return (

        <Container>

            <div className="current_info">
                <article>
                <p>Current firstname: {props.oldData.fornavn}</p>
                <p>Current lastname: {props.oldData.etternavn}</p>
                <p>Current tlfNumber: {props.oldData.tlfNummer}</p>
                <p>Current email: {props.oldData.epost}</p>
                <img src={props.oldData.bildelenke}
                    alt={props.oldData.bildeAltTekst}/>
                <p>Current alttekst: {props.oldData.bildeAltTekst}</p>
                </article>
            </div>

          <form>
            <input 
              type="text" 
              placeholder="Fornavn"
              onChange={props.handleChange}
              name="fornavn"
              value={props.formData.fornavn}
            />
            <input
              type="text"
              placeholder="Etternavn"
              onChange={props.handleChange}
              name="etternavn"
              value={props.formData.etternavn}
            />
            <input
              type="text"
              placeholder="Telefonnummer"
              onChange={props.handleChange}
              name="tlfNummer"
              value={props.formData.tlfNummer}
            />
            <input
              type="email"
              placeholder="Epost"
              onChange={props.handleChange}
              name="epost"
              value={props.formData.epost}
            />
            <input
              type="text"
              placeholder="Bildelenke"
              onChange={props.handleChange}
              name="bildelenke"
              value={props.formData.bildelenke}
            />
            <input
              type="text"
              placeholder="Bilde alt tekst"
              onChange={props.handleChange}
              name="bildeAltTekst"
              value={props.formData.bildeAltTekst}
            />

            <input
              type="button"
              text="Submit"
              onClick={props.handleSubmit}
            />

          </form>

        </Container>


    )
}