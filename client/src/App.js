import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom"
import Sidebar from "./component/sidebar/Sidebar.js"
import Main from "./component/main/Main"
import Edit from "./component/edit/Edit"

function App() {

  const [screen, setScreen] = React.useState('auth'); 

  return (
    
    <div className="body">
      <div className="App">
      <Sidebar screen={screen} setScreen={setScreen}/>
        <Routes>          
          <Route index element={<Main />} />                
          <Route path="/admin" element={screen === 'auth'?<Main />:<Edit screen={screen} setScreen={setScreen}/>} />
        </Routes>     
        
      </div>
    </div>
    
  );
}

export default App;