import React, { useState } from "react";
import OurButton from "../components/OurButton";

function Register({ username, email, password, birthDate, error, setUsername, setEmail, setPassword, setBirthDate, onSubmit }) {
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto space-y-4">
      <input
        type="text"
        placeholder="Uporabniško ime"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="password"
        placeholder="Geslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="password"
        placeholder="Ponovi geslo"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="input"
        placeholder="Datum rojstva"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />


      <OurButton type="submit" text={"Registracija"} classNameProps={"w-full"} variant="blue" />
    </form>
  );
}

export default Register;