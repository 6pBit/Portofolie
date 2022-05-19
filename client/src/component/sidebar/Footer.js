import React from 'react'
import {BsGearFill, BsXSquareFill} from 'react-icons/bs'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Sidebar.css'
import { Form, Button, Popover, Overlay, Toast } from 'react-bootstrap'



export default function Footer(props) {
    //localStorage.removeItem('login-open')
    const loginOpen = localStorage.getItem('login-open')
    const [isLoginVisible, setIsLoginVisible] = React.useState(loginOpen)
    
    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();

    const [show, setShow] = React.useState(false);

    const auth = async () => {
        try {
            const res = await axios.get('/auth/authenticate', { auth: { username, password } });
        
            if (res.data.screen !== undefined) {            
                props.setScreen(res.data.screen);            
                console.log("Axios get bra "+props.screen)
            }
        } catch (e) {
            console.log("Axios get feil "+e);
            //alert("Feil brukernavn/passord")
            setShow(true)
        }
    };
    const readCookie = async () => {
        try {
            const res = await axios.get('/auth/read-cookie');
            
            if (res.data.screen !== undefined) {
                props.setScreen(res.data.screen);
            }
        } catch (e) {
            
            console.log(e);
        }
    };
    const wrongPasswordMsg = (
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide={true}>
            <Toast.Header>Feil</Toast.Header>
            <Toast.Body>Feil passord/brukernavn</Toast.Body>
        </Toast>
    )
    
    React.useEffect(() => {
        localStorage.removeItem('login-open')
        readCookie();
    }, []);

    return(
        <div className='footer'>
            <Overlay></Overlay>
            <div className="login">
                {props.screen === 'auth' ?
                    <div className="loginForm">
                        
                        {isLoginVisible?
                            <>
                                {wrongPasswordMsg}
                                <BsXSquareFill onClick={() => setIsLoginVisible(false)}/>
                                <Form>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Brukernavn</Form.Label>
                                        <Form.Control type="text" placeholder="Brukernavn" onChange={e => setUsername(e.target.value)} value={username} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Passord</Form.Label>
                                        <Form.Control type="password" placeholder="Passord" onChange={e => setPassword(e.target.value)} value={password} />
                                    </Form.Group>                                
                                    <Link to="/admin" >
                                        <Button 
                                            variant="primary"  
                                            type="button" 
                                            onClick={() => {                                                                                              
                                                auth()
                                            }}
                                        >Login</Button>
                                    </Link>
                                </Form>
                                
                            </>
                            :<BsGearFill 
                                onClick={() => {
                                    setIsLoginVisible(true)
                                    
                                    }
                                }
                            />
                        }
                    </div>
                    :<Link to="/admin" ><BsGearFill /></Link>
                }
            </div>
            <p>&copy; UnicornUnicoders. All rights reserved.</p>
            
        </div>
    )
}