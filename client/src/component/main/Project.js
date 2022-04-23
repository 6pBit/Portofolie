import React from 'react'
import ProjectCard from "./ProjectCard"
import './css/Project.css'

export default function Project() {
    

    return (
        <div className="projectContainer" id='project'>
            <h1>Mine prosjekter</h1>
            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ultricies lectus a leo consectetur, sed mollis dolor rutrum. Etiam ac orci id mauris lacinia porttitor in id justo. Praesent nec posuere mauris. Integer rhoncus ullamcorper tortor, non tempus nunc tristique nec. Suspendisse vel est faucibus ipsum rhoncus lobortis. Donec egestas faucibus ligula, non tincidunt lectus dictum vehicula. In pretium lectus vitae nisi faucibus placerat. Etiam eget consectetur ante.

Vivamus vehicula, ligula a feugiat iaculis, sapien risus pellentesque nisl, a imperdiet erat magna sit amet ex. Cras malesuada gravida finibus. Donec aliquam bibendum finibus. Integer quis risus et felis elementum hendrerit. Donec ac augue nec eros maximus laoreet. Quisque feugiat odio id laoreet egestas. Vestibulum dolor purus, blandit non sem eget, pellentesque vehicula turpis. Integer cursus ornare diam sed ornare. Phasellus iaculis tincidunt lorem et aliquam.
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ultricies lectus a leo consectetur, sed mollis dolor rutrum. Etiam ac orci id mauris lacinia porttitor in id justo. Praesent nec posuere mauris. Integer rhoncus ullamcorper tortor, non tempus nunc tristique nec. Suspendisse vel est faucibus ipsum rhoncus lobortis. Donec egestas faucibus ligula, non tincidunt lectus dictum vehicula. In pretium lectus vitae nisi faucibus placerat. Etiam eget consectetur ante.

Vivamus vehicula, ligula a feugiat iaculis, sapien risus pellentesque nisl, a imperdiet erat magna sit amet ex. Cras malesuada gravida finibus. Donec aliquam bibendum finibus. Integer quis risus et felis elementum hendrerit. Donec ac augue nec eros maximus laoreet. Quisque feugiat odio id laoreet egestas. Vestibulum dolor purus, blandit non sem eget, pellentesque vehicula turpis. Integer cursus ornare diam sed ornare. Phasellus iaculis tincidunt lorem et aliquam.
 </p>
        <ProjectCard 
        
            title="Prosjekt tittel"
            image="https://www.gardeningknowhow.com/wp-content/uploads/2020/02/butterfly-400x300.jpg"
            altText="sommerfugl"
            description="Her er en beskrivelse av prosjektet som skal dukke opp når man hovrer over card"

        />
        
        </div>
    )
}