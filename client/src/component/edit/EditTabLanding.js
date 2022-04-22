import React from "react"
import Container from "react-bootstrap"

export default function EditTabLanding(props) {

    const [landingData, setLandingData] = React.useState({
        // data fra landing her bør styres og hentes fra Edit
    })

    // alt bør kanskje komme fra Edit? Blir mange useEffects der.
    function handleChange() {

    }

    function onSubmit(event) {
        
    }

    return(
        <Container>
            
            <form>

            </form>


        </Container>
    )

}