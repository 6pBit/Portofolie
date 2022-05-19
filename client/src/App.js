import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom"
import Sidebar from "./component/sidebar/Sidebar.js"
import Main from "./component/main/Main"
import Edit from "./component/edit/Edit"

import {MdDehaze as BurgerIkon} from 'react-icons/md'
import {MdClear as Cross} from 'react-icons/md'

function App() {
  //localStorage.removeItem('sidebar-open')
  const [screen, setScreen] = React.useState('auth'); 
  const sidebarOpen = localStorage.getItem('sidebar-open')
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(
    localStorage.getItem('sidebar-open') === 'true'
  )
  React.useEffect(() => {
    localStorage.setItem('sidebar-open', isSidebarVisible)
  },[isSidebarVisible])
  

  return (
    
    <div className="body">
      <div className="App">
        <div className="navBar">
            <h1 id="navBarTitle">Portefølje</h1>
            {isSidebarVisible
              ? <Cross onClick={() => {setIsSidebarVisible(!isSidebarVisible)}}/>
              : <BurgerIkon id="BurgerIconButton" aria-controls="Sidebar" aria-expanded="false" onClick={() => {setIsSidebarVisible(!isSidebarVisible)}} />
              
            }
        </div>
        <div className="underNavbar">
          <Sidebar screen={screen} setScreen={setScreen} sidebarVisible={isSidebarVisible} setSidebarVisible={setIsSidebarVisible} />
          <Routes>          
            <Route index element={<Main isSidebarVisible={isSidebarVisible} setIsSidebarVisible={setIsSidebarVisible} />} />                
            <Route path="/admin" element={screen === 'auth'?<Main />:<Edit screen={screen} setScreen={setScreen} setIsSidebarVisible={setIsSidebarVisible} />} />
          </Routes>     
        </div>
      </div>
    </div>
    
  );
}

export default App;