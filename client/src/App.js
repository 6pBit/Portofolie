import React from "react";
import logo from "./logo.svg";
import "./App.css";

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
      .then(async response => {
        console.log(response.ok)
      })

    fetch("/user")
      .then((res) => res.json())
      .then((data) => setData(data.message))
  },[])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  );
}

export default App;