import React from "react"
import {Container, Button} from "react-bootstrap"
import Bootstrap from "bootstrap"

export default function EditTabContact(props) {


    const isMounted = React.useRef(false)

    const [tableContent, setTableContent] = React.useState([{
        title: ""
    }])
    const [requestUpdate, setRequestUpdate] = React.useState(false)
    const [deleteStatus, setDeleteStatus] = React.useState(false)
    const [deleteArray, setDeleteArray] = React.useState()
    
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
           console.log(data + " data fra fetch tabContact"),
           setTableContent(data)
        ))
    }

    function loadProjects() {
        setRequestUpdate(!requestUpdate)
    }
    
    function deleteFromDatabase(projectsToDelete) {

    }

    function handleDelete(event) {
        console.log("Delete button pressed")
    }

    function readyDelete(event) {
        console.log("marker for sletting pressed")
        setDeleteStatus(!deleteStatus)
    }


    return (
        <Container>

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
                        onClick={readyDelete}
                    >Marker for sletting</Button>
                    <Button
                        key="6" 
                        variant="warning" 
                        name="siteDelete" 
                        disabled={!deleteStatus}
                        onClick={handleDelete}
                    >Slett</Button>
                </div>
            
            
            <table class="table table-hover">
                <thead>
                    <th scope="col">#</th>
                    <th scope="col">Prosjekter</th>
                </thead>
                <tbody>
                    {tableContent.map((project) => 
                        <tr>
                            <th scope="row">{project.title}</th>
                            <td>{deleteStatus && <input class="form-check-input" type="checkbox" value={project.title} id="flexCheckDefault"/>}</td>
                        </tr>
                    )}

                    <tr>
                        <th>Header</th>
                        <td>heriiiii</td>
                    </tr>
                </tbody>
            </table>

        </Container>
    )

}