import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate, useNavigate } from 'react-router-dom';
import RegisterModul from '../modules/Register';

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");
  const userContext = useContext(UserContext); 
  
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8080/user/save", {
      method: "POST",
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, birthDate, password })
    });
    const data = await res.json();
    if (data.message !== "Napaka ob registraciji!") {
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
        <RegisterModul
          username={username}
          email={email}
          password={password}
          birthDate={birthDate}
          error={error}
          setUsername={setUsername}
          setEmail={setEmail}
          setPassword={setPassword}
          setBirthDate={setBirthDate}
          onSubmit={handleRegister}
        />
      )}
    </div>
  );
}

export default Register;