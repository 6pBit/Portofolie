import React from 'react'
import './css/Contact.css'

export default function Contact() {
    const [email, setEmail] = React.useState({
        name:'',
        email:'',
        message:''
    })
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
            <form id="contact-form" onSubmit={handleSubmit} method="POST">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input name="name" type="text" className="form-control" valu={email.name} onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input name="email" type="email" className="form-control" aria-describedby="emailHelp" value={email.email} onChange={handleChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea name="message" className="form-control" rows="5" value={email.message} onChange={handleChange}></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </section>
    )
}