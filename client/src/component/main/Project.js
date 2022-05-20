import React from 'react'
import ProjectCard from "./ProjectCard"
import './css/Project.css'

/**
 * Puts together projectcards. Has a list of dummy info as backup
 * @returns Project Component
 */
export default function Project() {
    
    const [projectSiteContent, setProjectSiteContent] = React.useState({})
    const [projectsArrContent, setProjectsArrContent] = React.useState([
        {
            id:"987654321",
            title: "Prosjekt tittel",
            image: "https://www.gardeningknowhow.com/wp-content/uploads/2020/02/butterfly-400x300.jpg",
            altText: "sommerfugl",
            description: "Kort beskrivelse av prosjektet"
        },
        {
            id:"987654321",
            title: "Prosjekt tittel",
            image: "https://www.gardeningknowhow.com/wp-content/uploads/2020/02/butterfly-400x300.jpg",
            altText: "sommerfugl",
            description: "Kort beskrivelse av prosjektet"
        },
        {
            id:"987654321",
            title: "Prosjekt tittel",
            image: "https://www.gardeningknowhow.com/wp-content/uploads/2020/02/butterfly-400x300.jpg",
            altText: "sommerfugl",
            description: "Kort beskrivelse av prosjektet"
        },
        {
            id:"987654321",
            title: "Prosjekt tittel",
            image: "https://www.gardeningknowhow.com/wp-content/uploads/2020/02/butterfly-400x300.jpg",
            altText: "sommerfugl",
            description: "Kort beskrivelse av prosjektet"
        },
        {
            id:"987654321",
            title: "Prosjekt tittel",
            image: "https://www.gardeningknowhow.com/wp-content/uploads/2020/02/butterfly-400x300.jpg",
            altText: "sommerfugl",
            description: "Kort beskrivelse av prosjektet"
        },
        {
            id:"987654321",
            title: "Prosjekt tittel",
            image: "https://www.gardeningknowhow.com/wp-content/uploads/2020/02/butterfly-400x300.jpg",
            altText: "sommerfugl",
            description: "Kort beskrivelse av prosjektet"
        },
        {
            id:"987654321",
            title: "Prosjekt tittel",
            image: "https://www.gardeningknowhow.com/wp-content/uploads/2020/02/butterfly-400x300.jpg",
            altText: "sommerfugl",
            description: "Kort beskrivelse av prosjektet"
        },
        {
            id:"987654321",
            title: "Prosjekt tittel",
            image: "https://www.gardeningknowhow.com/wp-content/uploads/2020/02/butterfly-400x300.jpg",
            altText: "sommerfugl",
            description: "Kort beskrivelse av prosjektet"
        }
    ])

    React.useEffect(() => {
        fetch('/sites/projects')
        .then(response => response.json())
        .then(data => {
            setProjectSiteContent(data)
        })
    },[])
    React.useEffect(() => {
        fetch('/projects')
        .then(response => response.json())
        .then(data => {
            setProjectsArrContent(data)
        })
    },[])

    return (
        <section className="projectContainer" id='project'>
            <h1>{projectSiteContent.title || "Mine Prosjekter"}</h1>
            <div className="projectCardContainer" >
                {projectsArrContent.map(project => {
                    return(<ProjectCard 
                        id={project.id}            
                        title={project.title}
                        image={project.imageUrl}
                        altText={project.altText}
                        description={project.description}
                        projectUrl={project.projectUrl}
                    />)
                })}  
            </div>
        </section>
    )
}