import React from 'react'
import {BsGithub, BsFacebook, BsLinkedin, BsInstagram} from 'react-icons/bs'
import { IconContext } from "react-icons";
import './css/Contact.css'

export default function Contact() {
    const [email, setEmail] = React.useState({
        name:'',
        email:'',
        message:''
    })
    const [user, setUser] = React.useState({})

    React.useEffect(() => {
        fetch('/user')
        .then(response => response.json())
        .then(data => {
            setUser(JSON.parse(data.message))
        })
        
    },[])
    function resetForm(){
        setEmail({name: '', email: '', message: ''})
      }
    function handleChange(e) {
        setEmail(prevEmail => {
            return {
                ...prevEmail,
                [e.target.name]: e.target.value
            }
        })
    }
    function handleSubmit(e) {
        e.preventDefault();
        console.log(email)
        const requstSendEmail = {
            method:'POST',
            body: JSON.stringify(email),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        fetch('/email/send',requstSendEmail)
            .then(response => response.json())
            .then(response => {
                if(response.status === 'success') {
                    resetForm()
                } else if(response.status === 'fail') {
                    alert('Message failed to send')
                }
            })
    }

    return (
        <section className="contactContainer" id='contact'>
            <h1>Kontakt meg</h1>
            <div className="emailContainer">
                <form id="contact-form" onSubmit={handleSubmit} method="POST">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input name="name" type="text" className="form-control" value={email.name} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input name="email" type="email" className="form-control" aria-describedby="emailHelp" value={email.email} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea name="message" className="form-control" rows="5" value={email.message} onChange={handleChange}></textarea>
                    </div>
                    <button type="submit" className="submitBtn">Send melding</button>
                </form>
                <div className="contactInfoContainer" >
                    <p>{ `${user.fornavn} ${user.etternavn}` ||"Name loading"}</p>
                    <p>{ `Email: ${user.epost}` ||"Email loading"}</p>
                    <p>{ `Phone: ${user.tlfNummer}` ||"Phone loading"}</p>
                    <div className="someIconContainer" >
                        <IconContext.Provider value={{size: "1.5ems", className: "someIcons"}} >
                            <BsFacebook  />
                            <BsInstagram />
                            <BsGithub />
                            <BsLinkedin />
                        </IconContext.Provider>
                    </div>
                </div>
            </div>
        </section>
    )
}