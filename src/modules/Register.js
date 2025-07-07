import OurButton from "../components/OurButton";

function Register({ username, email, password, passwordSecond, birthDate, error, setUsername, setEmail, setPassword, setPasswordSecond, setBirthDate, onSubmit }) {

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto space-y-4">

      {/* vpis: Uporabniško ime */}
      <input
        type="text"
        placeholder="Uporabniško ime"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />

      {/* vpis: E-pošta */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />

      {/* vpis: Geslo 1 */}
      <input
        type="password"
        placeholder="Geslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />

      {/* vpis: Geslo 2 */}
      <input
        type="password"
        placeholder="Ponovi geslo"
        value={passwordSecond}
        onChange={(e) => setPasswordSecond(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />

      {/* vpis: Rojstni datum */}
      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Datum rojstva</label>
      <input
        id="birthDate"
        type="date"
        placeholder="Datum rojstva"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />

      {/* Prikaz napake */}
      {error && <label className="text-red-500 block">{error}</label>}

      {/* Gumb shrani */}
      <OurButton type="submit" text={"Registracija"} classNameProps={"w-full"} variant="blue" />
    </form>
  );
}

export default Register;