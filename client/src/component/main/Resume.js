import React from "react";
import { Element } from 'react-scroll'
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import './css/Resume.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Resume() {

    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);
    const [resumeData, setResumeData] = React.useState({
        title: "",
        resume: ""
    })
    
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
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
    function handleClick(event) {
        if(event.target.name === "next-page" && !(pageNumber+1 > numPages)) {
            console.log("Neste side ")
            setPageNumber(prev => (prev + 1))
            console.log("Sidenummer " + pageNumber)
        } else if(event.target.name === "prev-page" && !(pageNumber-1 < 1)){
            setPageNumber(prev => (prev - 1))
        }
    }

    React.useEffect(() => {
        getResume()
    }, [])

    return (
        
            <section id="resume" className="resumeContainer">
                <h1>Resume</h1>
                <p>Side {pageNumber} av {numPages}</p>
                <div className="cvContainer">
                    <div className="documentContainer">
                        <Document file={resumeData.resume} 
                                onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page pageNumber={pageNumber} />
                        </Document>
                    </div>
                    <button name="prev-page" onClick={handleClick} >Tilbake</button>
                    <button name="next-page" onClick={handleClick} >Frem</button>
                </div>
            </section>

        
    )
}