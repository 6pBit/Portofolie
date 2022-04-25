import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom"
import Sidebar from "./component/sidebar/Sidebar.js"
import Main from "./component/main/Main"
import Edit from "./component/edit/Edit"

function App() {
  //localStorage.removeItem('sidebar-collapsed')
  
  const sidebarCollapsed = localStorage.getItem('sidebar-collapsed')
  const [isVisible, setIsVisible] = React.useState(sidebarCollapsed? false : true)
  const [screen, setScreen] = React.useState('auth');

  function handleMenuVisibility() {
      if (isVisible) {
          setIsVisible(false)
          localStorage.setItem('sidebar-collapsed', true)
          return <Edit handleMenuVisibility={handleMenuVisibility} screen={screen} setScreen={setScreen}/>
      }
      setIsVisible(true)
      localStorage.removeItem('sidebar-collapsed')
  }
  

  return (
    
    <div className="body">
      <div className="App">
      <Sidebar  isVisible={isVisible} screen={screen} setScreen={setScreen}/>
        <Routes>          
          <Route index element={<Main />} />                
          <Route path="/admin" element={screen === 'auth'?<Main />:<Edit screen={screen} setScreen={setScreen}/>} />
        </Routes>     
        
      </div>
    </div>
    
  );
}

export default App;