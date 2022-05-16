import React from "react"
import {Container, Button, Modal, DropdownButton, Dropdown, ButtonGroup, Col, Row} from "react-bootstrap"
import Bootstrap from "bootstrap"
import { Form } from "react-bootstrap"


export default function EditTabContact(props) {

    let keyForItems = 0
    const isMounted = React.useRef(false)
    const [tableContent, setTableContent] = React.useState([{name: ""}])
    const [stateShowCheckboxes, setStateShowCheckboxes] = React.useState(false)
    const [currentOperation, setCurrentOperation] = React.useState({operation: ""})
    const [currentMedia, setCurrentMedia] = React.useState({name: ""})
    const [supportedSome, setSupportedSome] = React.useState([
        "facebook", "snapchat", "instagram", "twitter", "linkedin", "tiktok", "wechat"
    ])
    const [chosenSome, setChosenSome] = React.useState("")
    const [formData, setFormData] = React.useState({
        someName: "", 
        connectionUrl: ""
    })
    const [siteData, setSiteData] = React.useState({
        someName: "", 
        connectionUrl: ""
    })

    React.useEffect(() => {
        fetch("/user/someLinks")
        .then(response => response.json())
        .then(data => (
            setTableContent(data)
        ))
    }, [])

    React.useEffect(() => {
        //console.log("2 tabproject useffect ble kjørt")
        
    }, [currentMedia.name])

    //Oppdaterer state som holder på alle prosjekter fra databasen.
    function updateList() {
        fetch("/projects/titles")
        .then(response => response.json())
        .then(data => (
            //console.log(data + " data fra fetch editprojectstab"),
            setTableContent(data)
        ))
    }

    function handleSubmit(event) {

    }

    function handleChange(event) {
        
    }

     //helper funksjon som setter nåværende valgt prosjekt.
     function helper(event) {
        //console.log(event.target.name)
        setCurrentMedia({
            name: event.target.name
        })
        setCurrentMedia({
            operation: "view"
        })   
    }

    function handleItemClick(event) {
        setChosenSome(event.target.name)
        console.log("Valgt sosialt media: " + chosenSome)
    }

    function operationHelper(event) {
        if(event.target.name === "insert") {
           
        }
        setCurrentOperation({
            operation: event.target.name
        })
    }


    return (
        <Container>

            <table class="table table-sm table-hover caption-top table-bordered">
                
                <thead class="table-light">
                    <th scope="col">Sosiale medie-tilkoblinger</th>
                </thead>
                <tbody>
                    {tableContent.map((media) => 
                        
                        <tr>
                            <td scope="row">{media.someName}</td>
                            <td class="mr-0">
                                {<Button
                                    key="69" 
                                    variant="primary" 
                                    name={media.someName} 
                                    onClick={helper}
                                >Vis sosialt medie</Button>}
                            </td>
                            {stateShowCheckboxes &&
                                <td class="ml-1">
                                    <input class="form-check-input" type="checkbox" id="flexCheckDefault"/>
                                </td>
                            }
                        </tr>
                    )}
                </tbody>
                <tfooter></tfooter>
            </table>

            <Row>
                <Col>
                    <Form>
                        <Form.Group as={Row} controlId="formGroupTitle">
                                <Form.Label row sm={2}> {siteData.someName}</Form.Label>
                                <Form.Control type="text" value={formData.someName} name="someName" onChange={handleChange} placeholder="Tilkoblings-URL" disabled={currentOperation.operation === "view"}/>
                        </Form.Group>
                    </Form>
                </Col>
                <Col>
                    <DropdownButton
                        as={ButtonGroup}
                        key={keyForItems+1}
                        id="dropdownBtn"
                        variant="primary"
                        title={chosenSome === "" ? "Choose social media" : chosenSome}
                    >
                        {supportedSome.map((some) => 
                            <Dropdown.Item eventKey={keyForItems+1} name={some} onClick={handleItemClick}>{some}</Dropdown.Item>
                        )}
                    </DropdownButton>
                </Col>
                
            </Row>

            

           
                <Container>
                    {currentOperation.operation !== "insert" &&
                        <Row>
                            <Button
                                key="69" 
                                variant="primary" 
                                name="edit"
                                onClick={operationHelper}
                            >Activate Editing</Button>
                        </Row>
                    }
                    
                    <Form className="mb-3">
                            <Form.Group as={Col} controlId="formGroupTitle">
                                <Form.Label row sm={2}>Tittel</Form.Label>
                                <Form.Control type="text" value={formData.someName} name="someName" onChange={handleChange} placeholder="Tolkoblings-URL" disabled={!(currentOperation.operation === "edit" || currentOperation.operation === "insert")}/>
                            </Form.Group>
                            {(currentOperation.operation === "edit" || currentOperation.operation === "insert") &&
                                <Button key="5" variant="primary" name="siteSubmit" value={currentOperation.operation} onClick={handleSubmit}>{currentOperation.operation}</Button>
                            }
                    </Form>
                </Container>
            

        </Container>
    )

}