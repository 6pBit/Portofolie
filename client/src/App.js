import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter} from "react-router-dom"

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
    */
  },[])


  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>{!data ? "Loading..." : data}</p>
          <p>"halla"</p>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;