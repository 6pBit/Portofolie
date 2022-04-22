import React from "react"
import { Container } from "react-bootstrap"

export default function EditTabLanding(props) {

    return(
        <Container>
            
            <form>
                <input 
                    type="text" 
                    placeholder="Title"
                    onChange={props.handleChange} //må endres
                    name="title"
                    value={props.siteData.title}
                />
                <input
                    type="text"
                    placeholder="Inctroduction Text"
                    onChange={props.handleChange}
                    name="introductionTxt"
                    value={props.siteData.introductionTxt}
                />
                <input
                    type="file"
                    onChange={props.handleChange}
                    name="fileUpload"
                />
                <input
                    type="button"
                    onClick={props.handleSubmit}

                />
            </form>

        </Container>
    )

}