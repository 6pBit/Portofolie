import React from "react";
import "./App.css";
import { BrowserRouter} from "react-router-dom"
import Sidebar from "./component/sidebar/Sidebar.js"
import Main from "./component/main/Main"

function App() {
  const [data, setData] = React.useState([]);
  
  const landingRef = React.useRef()
  const projectRef = React.useRef()
  const resumeRef = React.useRef()
  const contactRef = React.useRef()
  const navRefList = [
    {navRef: landingRef},
    {navRef: projectRef},
    {navRef: resumeRef},
    {navRef: contactRef},
    
  ]
  
  React.useEffect(() => {
    
    /*
    const requestNewSite = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: "side-fra-frontend",
        title: "halla balla",
        introductionTxt: "Tabulator ftw"
      })
    }
    fetch("/sites/Landing", requestNewSite )
      .then( response => {
        console.log("fetch resultat "+response.json())
        setData(JSON.stringify(response.json()))
        
      })
    */
  },[])
  
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
  

  return (
    <BrowserRouter>
      <div className="body">
        <div className="App">
          
          <Main navRefList={navRefList}/>
          <Sidebar />
          
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;