import React from "react"
import { Container, Form, Button, Col } from "react-bootstrap"

export default function EditTabResume(props){

    const isMounted = React.useRef(false)
    const collection = "sites"

    const [resumeData, setResumeData] = React.useState({
        title: "",
        resume: ""
    })

    const [currentFile, setCurrentFile] = React.useState({

    })

    const [wishToUpdate, setWishToUpdate] = React.useState(false)


    React.useEffect(() => {
        fetch("/sites/resume")
        .then(response => response.json())
        .then(data => (
            setResumeData( {
                title: "",
                resume: data.file
            })
        ))
    }, [])

    React.useEffect(() => {
        if(isMounted.current) {
            insertFile()
        } else {
            isMounted.current = true
        }
    }, [wishToUpdate])


    function insertFile() {
        if(currentFile !== "" && currentFile !== null) {

            const fileData = new FormData()
            fileData.append("file", currentFile)

            const requestForLocalStorage = {
                method: 'POST',
                body: fileData
            }

            let requestForDatabase = {}

            fetch("/fileUpload/file", requestForLocalStorage)
            .then(response => response.json())
            .then(data => (
                console.log(data.file + " dette skal være fil urlen"),
               
                requestForDatabase = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(
                        {
                            file: data.file
                        }
                    )
                  },
                  
                  fetch(`/${collection}/resume`, requestForDatabase )
                      .then( response => {
                      console.log("fetch resultat etter post fra Editproject.js " + response.json())
                  })
            ))

        } else {
            
        }
    }


    function handleChange(event) {
        //console.log(event.target.value)
        
        setCurrentFile(() => {
            if((currentFile !== "" || currentFile !== null) && event.target.files[0] !== null) {
                return (event.target.files[0]) //fjerna return her  && event.target.files[0] !== null
            }
        })
        
    }

    function handleSubmit(event){
        event.preventDefault();
        setWishToUpdate(!wishToUpdate)
    }

    return(
        <Container>

            <embed src={resumeData.resume} width="800px" height="1500px"/>

            <Form.Group as={Col} controlId="formGroupTitle">
                <Form.Label column sm={2}>Bilde</Form.Label>
                <Form.Control id="fileInput" type="file" accept=".pdf, .jpg, .jpeg" name="file" onChange={handleChange} placeholder="File"/>
            </Form.Group>
            <Button key="1" variant="primary" name="siteSubmit" value="Edit" onClick={handleSubmit}>Edit</Button>

        </Container>
    )

}