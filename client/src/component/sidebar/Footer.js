import React from 'react'
import {BsGearFill} from 'react-icons/bs'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Sidebar.css'



export default function Footer(props) {
    localStorage.removeItem('login-open')
    const loginOpen = localStorage.getItem('login-open')
    const [isLoginVisible, setIsLoginVisible] = React.useState(loginOpen? true : false)

    
    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();

    const auth = async () => {
        try {
          const res = await axios.get('/auth/authenticate', { auth: { username, password } });
    
          if (res.data.screen !== undefined) {            
            props.setScreen(res.data.screen);            
            console.log("Axios get bra "+props.screen)
          }
        } catch (e) {
          console.log("Axios get feil "+e);
        }
    };
    const readCookie = async () => {
        try {
          const res = await axios.get('/auth/read-cookie');
          
          if (res.data.screen !== undefined) {
            props.setScreen(res.data.screen);
          }
        } catch (e) {
          props.setScreen('auth');
          console.log(e);
        }
    };
    
    React.useEffect(() => {
        readCookie();
    }, []);

    return(
        <div className='footer'>
            <h3>Footer</h3>
            <div className="login">
                {props.screen === 'auth' ?
                    <div className="loginForm">
                        {isLoginVisible?
                            <div>
                            <label>Username: </label>
                            <br/>
                            <input type="text" onChange={e => setUsername(e.target.value)} />
                            <br/>
                            <label>Password: </label>
                            <br/>
                            <input type="password" onChange={e => setPassword(e.target.value)} />
                            <br/>
                            <Link to="/admin" ><button onClick={auth}>Login</button></Link>
                            </div>
                            :<BsGearFill 
                                onClick={() => {
                                    setIsLoginVisible(true)
                                    localStorage.setItem('login-open', true)
                                    }
                                }
                            />
                        }
                    </div>
                    :<Link to="/admin" onClick={props.handleAdminRouting}><BsGearFill /></Link>
                }
            </div>
            
            
        </div>
    )
}