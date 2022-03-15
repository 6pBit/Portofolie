import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react"

function App() {
  const [backendData, setBackendData] = useState({data: null})

  console.log("App component kjørt")
  useEffect(() => {
    
    async function callBackendAPI() {
      const response = await fetch('/express_backend');
      const body = await response.json();
      
      if (response.status !== 200) {
        throw Error(body.message) 
      }      
      return body;
    }   
    
    callBackendAPI()
      .then(res => setBackendData({data: res.express}))
      .catch(error => console.log(error))
      
  }, [])

  

  return (
    <div className="App">
      <header className="App-header">
        
        <p>
          {backendData.data}
        </p>
        
      </header>
    </div>
  );
}

export default App;
