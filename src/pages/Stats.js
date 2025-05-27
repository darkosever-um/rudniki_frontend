import React, { useEffect, useState } from 'react';

function Stats() {
  const [mines, setMines] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMines = async () => {
      try {
        const res = await fetch(`http://localhost:8080/mines/`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setMines(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMines();
  }, []);

  if (error) return <div className="p-16 text-red-600">Napaka: {error}</div>;
  if (!mines) return <div className="p-16">Nalaganje podatkov...</div>;

  return (
    <div className="p-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Statistika rudnikov</h1>
    </div>
  );
}

export default Stats;