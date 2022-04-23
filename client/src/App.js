import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom"
import Sidebar from "./component/sidebar/Sidebar.js"
import Main from "./component/main/Main"
import Edit from "./component/edit/Edit"

function App() {
  const [data, setData] = React.useState([]);
  const sidebarCollapsed = localStorage.getItem('sidebar-collapsed')
  const [isVisible, setIsVisible] = React.useState(sidebarCollapsed? false : true)

  function handleMenuVisibility() {
      if (isVisible) {
          setIsVisible(false)
          localStorage.setItem('sidebar-collapsed', true)
          return
      }
      setIsVisible(true)
      localStorage.removeItem('sidebar-collapsed')
  }
  /*
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
  */
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
    
    <div className="body">
      <div className="App">
        <Routes>          
          <Route index element={<Main />} />                
          <Route path="/admin" element={<Edit handleMenuVisibility={handleMenuVisibility}/>} />
        </Routes>             
        <Sidebar handleMenuVisibility={handleMenuVisibility} isVisible={isVisible}/>
      </div>
    </div>
    
  );
}

export default App;