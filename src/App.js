import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from './userContext';

import Nav from './modules/Nav';
import Home from './pages/Home';
import Login from './pages/Login';
import LogOut from './pages/LogOut';
import Mine from './pages/Mine';
import Stats from './pages/Stats';

function App() {
  
  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
  const updateUserData = (userInfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{
          user: user,
          setUserContext: updateUserData
        }}
      >
        <div className="App">
          <Nav/>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/Login" element={<Login />}></Route>
              <Route path="/LogOut" element={<LogOut />}></Route>
              <Route path="/Mine/:id" element={<Mine />}></Route>
              <Route path="/Stats" element={<Stats />}></Route>
            </Routes>
          </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
