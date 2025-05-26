import OurButton from "../components/OurButton";

function Login({ username, password, error, setUsername, setPassword, onSubmit }) {
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
        type="password"
        placeholder="Geslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      {error && <label className="text-red-500 block">{error}</label>}
      <OurButton type="submit" text={"Prijava"} classNameProps={"w-full"} variant="blue" />
      <p>Ali</p>
      <a href="/register" className="text-blue-500 hover:text-blue-700">Registracija novega uporabnika</a>
    </form>
  );
}

export default Login;