import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter} from "react-router-dom"
import Sideheader from "./component/sideheader/Sideheader.js"
import Main from "./component/main/Main"
import Title from "./component/sideheader/Title"

import { Link } from "react-scroll";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    
  
    const requestNewSite = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: "side-fra-frontend",
        title: "halla balla"
      })
    }
    fetch("/sites", requestNewSite )
      .then( response => {
        console.log("fetch resultat "+response.json())
        setData(JSON.stringify(response.json()))
        
      })
    /*
    fetch("/user")
      .then((res) => res.json())
      .then((data) => setData(data.message))

    <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{!data ? "Loading..." : data}</p>
          <p>"halla"</p>
        </header>
    */
  },[])


  return (
    <BrowserRouter>
      <div className="body">
        <div className="App">
          
          <Main />
          <Sideheader />
          
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;