import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate, useNavigate } from 'react-router-dom';
import LoginModul from '../modules/Login';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const userContext = useContext(UserContext); 
  
  // za navigiranje ob uspešni prijavi
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8080/user/", {
      method: "POST",
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.message !== "Napaka ob prijavi!") {
      userContext.setUserContext(data.message);
      navigate('/');
    } else {
      setUsername("");
      setPassword("");
      setError("Neveljavno uporabniško ime ali geslo.");
    }
  }

  return (
    <div className="pt-16">
      {userContext.user ? <Navigate replace to="/Profil" /> : (
        // Prikaz prijavnega modula
        <LoginModul
          username={username}
          password={password}
          error={error}
          setUsername={setUsername}
          setPassword={setPassword}
          onSubmit={handleLogin}
        />
      )}
    </div>
  );
}

export default Login;