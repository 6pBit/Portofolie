import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from "react"

function App() {
  const [backendData, setBackendData] = useState({data: null})


  useEffect((callBackendAPI) => {
      callBackendAPI()
        .then(res => setBackendData({data: res.express}))
        .catch(error => console.log(error))
  })

  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/*test*/}
        <p>
          Edit <code>src/App.js</code> and save to reload. {backendData.data}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
