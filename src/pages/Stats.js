import React, { useState, useEffect } from "react";

function Stats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [selectedStat, setSelectedStat] = useState("minesPerMunicipality");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:8080/mine/statistics`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  const menuOptions = [
    { key: "minesPerMunicipality", label: "Rudniki po občinah" },
    { key: "minesPerYear", label: "Rudniki po letih" },
    { key: "minesByType", label: "Rudniki po vrsti" },
  ];

  const renderStat = () => {
    if (!stats) return <p>Nalaganje podatkov...</p>;

    switch (selectedStat) {
      case "minesPerMunicipality":
        return (stats.minesPerMunicipality || []).map((entry, idx) => (
          <div key={idx} className="mb-2 p-2 border rounded">
            <p><strong>{entry.municipality}</strong>: {entry.count} rudnikov</p>
          </div>
        ));
      case "minesPerYear":
        return (stats.minesPerYear || []).map((entry, idx) => (
          <div key={idx} className="mb-2 p-2 border rounded">
            <p><strong>{entry.year}</strong>: {entry.count} rudnikov</p>
          </div>
        ));
      case "minesByType":
        return (stats.minesByType || []).map((entry, idx) => (
          <div key={idx} className="mb-2 p-2 border rounded">
            <p><strong>{entry.type}</strong>: {entry.count} rudnikov</p>
          </div>
        ));
      default:
        return <p>Ni podatkov za izbrano statistiko.</p>;
    }
  };

  if (error) {
    return <div className="p-16 text-red-600">Napaka: {error}</div>;
  }

  if (!stats) {
    return <div className="p-16">Nalaganje podatkov...</div>;
  }

  return (
    <div className="p-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Statistika rudnikov</h1>

      <div className="mb-8 flex flex-wrap gap-2 items-center justify-center">
        {menuOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => setSelectedStat(option.key)}
            className={`px-4 py-2 rounded-3xl border ${
              selectedStat === option.key
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500 border-blue-500"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {renderStat()}
    </div>
  );
}

export default Stats;