import React, { useState } from "react";
import OurButton from "../components/OurButton";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ko bo kredi BACKEND
    /*
    try {
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });
      console.log("Uspešna prijava:", response.data);
    } catch (error) {
      console.error("Napaka pri prijavi:", error);
    }
    */

    console.log("Login podatki:", { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
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
      <OurButton type="submit" text={"Prijava"} classNameProps={"w-full"} variant="blue"/>
    </form>
  );
}

export default Login;