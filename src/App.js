import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from './userContext';

import Nav from './modules/Nav';
import Home from './pages/Home';
import Login from './pages/Login';

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
              <Route path="/" exact element={<Home />}></Route>
              <Route path="/Login" exact element={<Login />}></Route>
            </Routes>
          </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
