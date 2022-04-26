import React from "react"

import {Card} from "react-bootstrap"
import './css/ProjectCard.css'

export default function ProjectCard(props) {
    /* Finn ut av dette
    function handleHover(e) {
        console.log("hover event "+JSON.stringify(e.target))
        e.target.querySelector('Card.Img').style.height = '25vh'
    }
    */

    return (

        <Card className="project_card bg-dark text-white" style={{ width: '18rem' }} >            
            <Card.Img id={props.id} src={props.image} alt={props.altText} className="card_img " />            
            <Card.ImgOverlay>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text className="card_description">
                    {props.description}
                </Card.Text>
            </Card.ImgOverlay>
        </Card>
    )
}