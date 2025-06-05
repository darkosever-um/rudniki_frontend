import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

        data.minesPerYear.sort((a, b) => a.year - b.year);

        setStats(data);
        console.log("Statistics fetched:", data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  const menuOptions = [
    { key: "minesByMineral", label: "Rudniki po mineralih" },
    { key: "minesByMineralGrade", label: "Rudniki po oceni minerala" },
    { key: "minesByStatus", label: "Rudniki po statusu" },
    { key: "minesByType", label: "Rudniki po vrsti" },
    { key: "minesPerMunicipality", label: "Rudniki po občinah" },
    { key: "minesPerYear", label: "Rudniki po letih" },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28", "#0088FE"];

  const renderStat = () => {
    if (!stats) return <p>Nalaganje podatkov...</p>;

    switch (selectedStat) {
      case "minesByMineral":
        return (
          <ResponsiveContainer width="100%" height={520}>
            <PieChart>
              <Pie
                data={stats.minesByMineral}
                dataKey="count"
                nameKey="mineral"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label
              >
                {stats.minesByMineral.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case "minesByMineralGrade":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.minesByMineralGrade}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Rudnikov" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "minesByStatus":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.minesByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ffc658" name="Rudnikov" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "minesByType":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={stats.minesByType}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={130}
                label
              >
                {stats.minesByType.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case "minesPerMunicipality":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.minesPerMunicipality}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="municipality" angle={-45} fontSize={8} textAnchor="end" height={150} interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0088FE" name="Rudnikov" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "minesPerYear":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.minesPerYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year"  fontSize={8}/>
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Rudnikov" />
            </BarChart>
          </ResponsiveContainer>
        );

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
    <div className="p-16 max-w-5xl mx-auto">
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

      <div className="h-[400px]">{renderStat()}</div>
    </div>
  );
}

export default Stats;