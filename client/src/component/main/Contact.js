import React from 'react'
import {BsGithub, BsFacebook, BsLinkedin, BsInstagram} from 'react-icons/bs'
import { IconContext } from "react-icons";
import { Toast } from 'react-bootstrap'
import './css/Contact.css'

export default function Contact() {
    const [email, setEmail] = React.useState({
        name:'',
        email:'',
        message:''
    })
    const [user, setUser] = React.useState({})
    const [soMe, setSoMe] = React.useState([])
    const [show, setShow] = React.useState(false);
    const [toastMsg, setToastMsg] = React.useState({
        title:'',
        msg:''
    })
    const [toastDelay, setToastDelay] = React.useState(3000)

    const meldingSendtPop = (
        <Toast onClose={() => setShow(false)} show={show} delay={toastDelay} autohide={true}>
            <Toast.Header>{toastMsg.title}</Toast.Header>
            <Toast.Body>{toastMsg.msg}</Toast.Body>
        </Toast>
    )

    React.useEffect(() => {
        fetch('/user')
        .then(response => response.json())
        .then(data => {
            setUser(JSON.parse(data.message))
        })
        fetch('/user/someLinks')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setSoMe(data)
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
        if(email.name === '' || email.email === '' || email.message === '') {
            setToastMsg({
                title: 'Feil',
                msg: 'Alle felt må være fylt ut!'
            })
            setToastDelay(10000)
            setShow(true)
        } else {
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
                        setToastMsg({
                            title: 'Suksess',
                            msg: 'Meldingen er sendt!'
                        })
                        setToastDelay(3000)
                        setShow(true)
                    } else if(response.status === 'fail') {
                        setToastMsg({
                            title: 'Prøv igjen',
                            msg: 'Meldingen ble ikke sendt!'
                        })
                        setToastDelay(3000)
                        setShow(true)
                    }
                })
        }
    }
    function getSoMeLink(name) {       
        soMe.forEach(some => {
            console.log(some.someName+" "+ name)
            if(some.someName === name) {
                window.open(some.connectionUrl)
                return some.connectionUrl;
            }
        });       
    } 

    return (
        <section className="contactContainer" id='contact'>
            <h1>Kontakt meg</h1>
            {meldingSendtPop}
            <div className="emailContainer">
                <form id="contact-form" onSubmit={handleSubmit} method="POST">
                    <div className="form-group">
                        <label htmlFor="name">Navn</label>
                        <input name="name" type="text" className="form-control" value={email.name} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Epost addresse</label>
                        <input name="email" type="email" className="form-control" aria-describedby="emailHelp" value={email.email} onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Melding</label>
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
                            <div onClick={(e) => getSoMeLink('facebook')} ><BsFacebook /></div>
                            <div onClick={(e) => getSoMeLink('instagram')}> <BsInstagram /></div>
                            <div onClick={(e) => getSoMeLink('github')} ><BsGithub /></div>
                            <div onClick={(e) => getSoMeLink('linkedin')} ><BsLinkedin  /></div>
                        </IconContext.Provider>
                    </div>
                </div>
            </div>
        </section>
    )
}