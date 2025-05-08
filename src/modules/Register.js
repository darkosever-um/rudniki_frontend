import React, { useState } from "react";
import OurButton from "../components/OurButton";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState({ day: "", month: "", year: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.error("Gesli se ne ujemata!");
      return;
    }

    // Ko bo kredi BACKEND
    /*
    try {
      const response = await axios.post("http://localhost:3001/register", {
        username,
        email,
        password,
        birthDate: `${birthDate.year}-${birthDate.month}-${birthDate.day}`,
      });
      console.log("Registracija uspešna:", response.data);
    } catch (error) {
      console.error("Napaka pri registraciji:", error);
    }
    */

    console.log("Registracijski podatki:", {
      username,
      email,
      password,
      birthDate: `${birthDate.year}-${birthDate.month}-${birthDate.day}`,
    });
  };

  // priprava podatkov za vnos datuma
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Januar", "Februar", "Marec", "April", "Maj", "Junij",
    "Julij", "Avgust", "September", "Oktober", "November", "December"
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
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

      <div className="flex gap-2">
        <select
          value={birthDate.day}
          onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
          className="w-1/3 p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Dan</option>
          {days.map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <select
          value={birthDate.month}
          onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}
          className="w-1/3 p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Mesec</option>
          {months.map((month, index) => (
            <option key={index + 1} value={index + 1}>{month}</option>
          ))}
        </select>

        <select
          value={birthDate.year}
          onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
          className="w-1/3 p-2 border border-gray-300 rounded"
          required
        >
          <option value="">Leto</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <OurButton type="submit" text={"Registracija"} classNameProps={"w-full"} variant="blue" />
    </form>
  );
}

export default Register;