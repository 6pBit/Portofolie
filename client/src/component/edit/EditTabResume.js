import React from "react"
import { Container, Form, Button, Col, Row , Modal} from "react-bootstrap"
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
    const [wishToRefresh, setWishToRefresh] = React.useState(false)

    const [showAlert, setShowAlert] = React.useState(false)
    const [alertContent, setAlertContent] = React.useState("")


    React.useEffect(() => {
        getResume()
    }, [wishToRefresh])

    React.useEffect(() => {
        if(isMounted.current) {
            deleteFile()
            insertFile()
        } else {
            isMounted.current = true
        }
    }, [wishToUpdate])

    function getResume() {
       
        fetch("/sites/resume")
        .then(response => response.json())
        .then(data => (
            
            setResumeData( {
                title: "",
                resume: data.file
            })
        ))
    }


    function insertFile() {
        if(currentFile !== "" && currentFile !== null) {

            const fileData = new FormData()
            fileData.append("file", currentFile)

            let requestForDatabase = {
                method: 'POST',
                body: fileData
            }

            fetch("/fileUpload/file", requestForDatabase)
            .then(response => response.json()) 
            .then(data => (
                console.log(data.file + " dette skal være fil urlen"),
               
                requestForDatabase = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(
                        {
                            file: data.fileUrl
                        }
                    )
                  },
                  
                  fetch(`/${collection}/resume`, requestForDatabase )
                      .then( response => {
                        console.log("fetch resultat etter post fra Editproject.js " + response.json())
                        setWishToRefresh(!wishToRefresh)
                  })
            ))

        } else {
            
        }
    }

    function deleteFile() {

        let requestForDatabase = {}

        fetch("/sites/resume")
        .then(response => response.json())
        .then(data => (
            requestForDatabase = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                    {
                        filePaths: [data.file]
                    }
                )
            },
            fetch(`/fileUpload/delete/fromAws`, requestForDatabase )
            .then(response => {
                console.log("fetch resultat etter post fra Editproject.js " + response.json())
            })
        ))
    }


    function handleChange(event) {
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

    //kopiert
    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function handleClick(event) {
        if(event.target.name === "next-page" && !(pageNumber+1 > numPages)) {
            console.log("Neste side ")
            setPageNumber(prev => (prev + 1))
            console.log("Sidenummer " + pageNumber)
        } else if(event.target.name === "prev-page" && !(pageNumber-1 < 1)){
            setPageNumber(prev => (prev - 1))
        }
    }

    function handleAlert(content) {
        console.log("heiiiiiii")
        setAlertContent(content)
        setShowAlert(true)
        setTimeout(() => {
          setAlertContent("")
          setShowAlert(false)
          //setRequestReload(!requestReload)
          
        }, 3000)
      }

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

            <Row>
                <Button
                    key="5" 
                    variant="primary" 
                    name="prev-page" 
                    onClick={handleClick}
                >Previous</Button>
                <Button
                    key="5" 
                    variant="primary" 
                    name="next-page" 
                    onClick={handleClick}
                >Next</Button>
                <span className="page-info">
                    Page <span>{pageNumber}</span> of <span>{numPages}</span>
                </span>
            </Row>

           
            
            <Document file={resumeData.resume} 
                      onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>

            <Form.Group as={Col} controlId="formGroupTitle">
                <Form.Label column sm={2}>CV fil</Form.Label>
                <Form.Control id="fileInput" type="file" accept=".pdf, .jpg, .jpeg" name="file" onChange={handleChange} placeholder="File"/>
            </Form.Group>
            <Button key="1" variant="primary" name="siteSubmit" value="Edit" onClick={handleSubmit}>Edit</Button>

        </Container>
    )

}

//  <embed src={resumeData.resume} width="800px" height="1000px"/>