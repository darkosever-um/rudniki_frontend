import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate, useNavigate } from 'react-router-dom';
import RegisterModul from '../modules/Register';

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordSecond, setPasswordSecond] = useState("");
  const [birthDate, setBirthDate] = useState(0);
  const [error, setError] = useState("");
  const userContext = useContext(UserContext); 
  
  const navigate = useNavigate();

  async function handleRegister(e) {

    if(password !== passwordSecond) {
      setError("Gesli se ne ujemata.");
    } else if (username === "" || email === "" || password === "" || birthDate === 0) {
      setError("Vsa polja so obvezna.");
    } else {
      e.preventDefault();
      const res = await fetch("http://127.0.0.1:8080/user/save", {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, birthDate: new Date(birthDate).getTime(), password })
      });

      const data = await res.json();

      if (data.message !== "Napaka ob registraciji!" && data.message !== "Napaka ob prijavi: Nepravilni podatki" && data.message !== "Napaka pri dodajanju uporabnika!") {
        userContext.setUserContext(data.message);
        navigate('/');
      } else {
        alert(data.message);
        setUsername("");
        setPassword("");
        setPasswordSecond("");
        setError("Neveljavno uporabniško ime ali geslo.");
      }
    }
  }

  return (
    <div className="pt-16">
      {userContext.user ? <Navigate replace to="/Profil" /> : (
        // Prikaz registracijskega modula
        <RegisterModul
          username={username}
          email={email}
          password={password}
          passwordSecond={passwordSecond}
          birthDate={birthDate}
          error={error}
          setUsername={setUsername}
          setEmail={setEmail}
          setPassword={setPassword}
          setPasswordSecond={setPasswordSecond}
          setBirthDate={setBirthDate}
          onSubmit={handleRegister}
        />
      )}
    </div>
  );
}

export default Register;