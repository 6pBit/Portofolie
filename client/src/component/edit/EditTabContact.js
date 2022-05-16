import React from "react"
import {Container, Button, Modal} from "react-bootstrap"
import Bootstrap from "bootstrap"


export default function EditTabContact(props) {


    const isMounted = React.useRef(false)


    const [showPopup, setShowPopup] = React.useState(false)

    const [tableContent, setTableContent] = React.useState([{
        title: ""
    }])
    const [requestUpdate, setRequestUpdate] = React.useState(false)
    const [stateShowCheckboxes, setStateShowCheckboxes] = React.useState(false)
    const [deleteArray, setDeleteArray] = React.useState([])
    
    React.useEffect(() => {
        console.log("kun første render effect")
        getAllProjectTitles()
    }, [])

    React.useEffect(() => {
        if(isMounted.current) {
            console.log("1 tabcontact useffect ble kjørt")
            getAllProjectTitles()
        } else {
            isMounted.current = true
        }
        
    }, [requestUpdate])
    

    
    function getAllProjectTitles() {
        fetch("/projects/titles")
        .then(response => response.json())
        .then(data => (
           //console.log(data + " data fra fetch tabContact"),
           setTableContent(data)
        ))
    }

    function handleDelete(event) {
        /*
        [...document.querySelectorAll('input[type=checkbox]:checked')].map(box => setDeleteArray((prev) => {
            console.log("Dette er box.value: " + box.value)
            return({
                ...prev,
                title: box.value
            })
        }))
        */
        //fiks løsning
        const all = document.querySelectorAll('input[type=checkbox]:checked')
        let tempList = []
        for(let i=0; i<all.length; i++) {// kanskje legge til en forEach her istedenfor
            tempList.push(all[i].value)
        }
        setDeleteArray(tempList)
        //console.log("Her er alle titlene fra bokser som var valgt ved sletting")
        
        setShowPopup(!showPopup)
               
        deleteArray.map(item => console.log("Tittel fra deleteArray:" + item.title))
        console.log("Delete button pressed")
    }

    function showCheckboxes() {
        //console.log("marker for sletting pressed")
        setStateShowCheckboxes(!stateShowCheckboxes)
    }

    function handleClose() {
        setDeleteArray([])
        setShowPopup(!showPopup)
        
    }

    function deleteProjects() {

       let temp = deleteArray.map((title) => {
           return(
               title + ""
           )
       })

        let inputString = temp.toString().replaceAll(',', '+')
        let requestForDatabase = {}
        console.log(inputString + " før den blir send til imagestodelete")
        fetch(`/projects/imagesToDelete/${inputString}`)
        .then(response => response.json())
        .then(data => {
            //temp = data
            //console.log(JSON.stringify(data + " data fra imagesToDelete og puttes inn i fileopload delete images"))
            requestForDatabase = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({filePaths: [data]})
            }
            
            //console.log(JSON.stringify(tempArray + " tempArray fra imagesToDelete og puttes inn i fileopload delete images"))
            fetch("/fileUpload/delete/images", requestForDatabase)
            .then(response => response.json())
            .then(data => {
               console.log("Ferdig med lokal bildesletting")
    
                console.log(" data etter lokal sletting av bilder")
                //flytt alt under ut, så virker sletting.
               
            })

            //console.log("Her er delteArray på clientsiden: " + JSON.stringify(deleteArray))
            requestForDatabase = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({titles: deleteArray})
            }

            fetch("/projects/deleteSeveral", requestForDatabase)
            .then(response => response.json())
            .then(data => {
                //data.map(project => console.log(project.title + " ble slettet fra databasen"))
                setDeleteArray([])
                setShowPopup(!showPopup)
                showCheckboxes()
            })

        })

        
    }


    return (
        <Container>

            {deleteArray != null && 
                <Modal
                    show={showPopup}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header>
                        <Modal.Title>Du er iferd med å slette følgende prosjekter:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Her kommer noe tekst evt en state
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Lukk</Button>
                        <Button variant="primary" onClick={deleteProjects}>Slett</Button>
                    </Modal.Footer>
                </Modal>
            }

            <Button
                key="5" 
                variant="primary" 
                name="siteSubmit" 
                onClick={getAllProjectTitles}
            >Load projects</Button>

            
                <h2>Sletting av prosjekter</h2>
                <div>
                    <Button
                        key="5" 
                        variant="primary" 
                        name="siteSubmit" 
                        onClick={showCheckboxes}
                    >Marker for sletting</Button>
                    <Button
                        key="6" 
                        variant="danger" 
                        name="siteDelete" 
                        disabled={!stateShowCheckboxes}
                        onClick={handleDelete}
                    >Slett</Button>
                </div>
            
            
            <table class="table table-sm table-hover caption-top table-bordered">
                <caption>Alle prosjekter</caption>
                <thead class="table-light">
                    <th scope="col">Prosjektnavn</th>
                </thead>
                <tbody>
                    {tableContent.map((project) => 
                        <tr>
                            <td scope="row">{project.title}</td>
                            <td class="mr-0">
                                {<Button
                                    key="69" 
                                    variant="primary" 
                                    name="visProsjekt" 
                                    //onClick={}
                                >Vis prosjekt</Button>}
                            </td>
                            {stateShowCheckboxes &&
                                <td class="ml-1">
                                    <input class="form-check-input" type="checkbox" value={project.title} id="flexCheckDefault"/>
                                </td>
                            }
                        </tr>
                    )}
                </tbody>
                <tfooter></tfooter>
            </table>

        </Container>
    )

}