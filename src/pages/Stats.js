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
  AreaChart,
  Area
} from "recharts";

function Stats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [selectedStat, setSelectedStat] = useState("minesPerMunicipality");
  
  const [helmetData, setHelmetData] = useState(null);
  const [loadingHelmet, setLoadingHelmet] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:8080/mine/statistics`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        if (data.minesPerYear) {
            data.minesPerYear.sort((a, b) => a.startYear - b.startYear);
        }

        setStats(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  const fetchHelmetDataRange = async () => {
    if (!startDate || !endDate) {
      alert("Prosim, izberite začetni in končni datum.");
      return;
    }

    setLoadingHelmet(true);
    try {
      const startTimestamp = new Date(startDate).setHours(0, 0, 0, 0);
      const endTimestamp = new Date(endDate).setHours(23, 59, 59, 999);

      const res = await fetch(`http://localhost:8080/mine/helmetDataRange/${startTimestamp}/${endTimestamp}`);
      
      if (!res.ok) throw new Error(`Napaka pri klicu API-ja: ${res.status}`);
      
      const data = await res.json();
      
      if (!data || !data.data || data.data.length === 0) {
        alert("Za izbrano obdobje ni podatkov.");
        setHelmetData(null);
      } else {
        setHelmetData(data);
        setAppliedStartDate(startDate);
        setAppliedEndDate(endDate);
      }
      
    } catch (err) {
      console.error(err);
      alert("Napaka pri pridobivanju podatkov: " + err.message);
    } finally {
      setLoadingHelmet(false);
    }
  };

  const menuOptions = [
    { key: "minesByMineral", label: "Rudniki po mineralih" },
    { key: "minesByMineralGrade", label: "Minerali po oceni" },
    { key: "minesByStatus", label: "Rudniki po statusu" },
    { key: "minesByType", label: "Rudniki po vrsti" },
    { key: "minesPerMunicipality", label: "Rudniki po občinah" },
    { key: "minesPerYear", label: "Rudniki po letih" },
    { key: "helmet", label: "Nošenje čelad" },
  ];

  const COLORS = ["#2463eb", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28", "#0088FE"];

  const renderStat = () => {
    if (!stats && selectedStat !== "helmet") return <p>Nalaganje podatkov...</p>;

    switch (selectedStat) {
      case "minesByMineral":
        return (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Število rudnikov po mineralih
            </div>
            <div className="divide-y divide-gray-200">
              {stats.minesByMineral.map((stat) => (
                <div key={stat.mineral} className="flex items-center justify-between px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition">
                  <span>{stat.mineral}</span>
                  <span className="font-medium text-gray-900">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
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
              <Bar dataKey="count" fill="#2463eb" name="Mineralov" />
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
              <Bar dataKey="count" fill="#2463eb" name="Rudnikov" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "minesByType":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={stats.minesByType} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={130} label>
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
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Število rudnikov po občinah
            </div>
            <div className="divide-y divide-gray-200">
              {stats.minesPerMunicipality.map((stat) => (
                <div key={stat.municipality} className="flex items-center justify-between px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition">
                  <span>{stat.municipality}</span>
                  <span className="font-medium text-gray-900">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "minesPerYear":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={stats.minesPerYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="startYear" fontSize={10} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#2463eb" name="Rudnikov" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "helmet":
        let chartData = [];
        let summary = null;

        if (helmetData) {
          summary = helmetData.stats;
          
          const isSingleDay = appliedStartDate === appliedEndDate;

          if (isSingleDay) {
            chartData = helmetData.data.map((item) => ({
              ...item,
              formattedTime:
                new Date(item.timestamp).toLocaleTimeString("sl-SI", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
            }));
          } else {
            const groupedByDay = {};

            helmetData.data.forEach((item) => {
              const dateObj = new Date(item.timestamp);
              const dateKey = dateObj.toLocaleDateString("sl-SI");

              if (!groupedByDay[dateKey]) {
                groupedByDay[dateKey] = {
                  totalPersonsSum: 0,
                  helmetsOnSum: 0,
                  timestamp: item.timestamp,
                };
              }

              groupedByDay[dateKey].totalPersonsSum += item.totalPersons;
              groupedByDay[dateKey].helmetsOnSum += item.helmetsOn;
            });

            chartData = Object.values(groupedByDay).map((dayData) => ({
              formattedTime: new Date(dayData.timestamp).toLocaleDateString("sl-SI", {
                day: "numeric",
                month: "numeric",
              }),
              totalPersons: dayData.totalPersonsSum,
              helmetsOn: dayData.helmetsOnSum,
              
              rawTimestamp: dayData.timestamp
            }));

            chartData.sort((a, b) => a.rawTimestamp - b.rawTimestamp);
          }
        }

        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Od datuma:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Do datuma:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={fetchHelmetDataRange}
                disabled={loadingHelmet}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition disabled:bg-blue-300"
              >
                {loadingHelmet ? "Nalaganje..." : "Prikaži statistiko"}
              </button>
            </div>

            {!helmetData ? (
              <div className="text-center py-10 text-gray-500">
                {loadingHelmet
                  ? "Nalaganje podatkov..."
                  : "Izberite datumsko obdobje in kliknite Prikaži."}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <p className="text-xs text-gray-500 uppercase">Skeniranj</p>
                    <p className="text-xl font-bold text-gray-800">
                      {summary.total_scans}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-500">
                    <p className="text-xs text-gray-500 uppercase">Skupaj oseb (Vsota)</p>
                    <p className="text-xl font-bold text-gray-800">
                      {summary.total_persons}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                    <p className="text-xs text-gray-500 uppercase">Kršitve</p>
                    <p className="text-xl font-bold text-red-600">
                      {summary.safety_violations}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <p className="text-xs text-gray-500 uppercase">Skladnost</p>
                    <p className="text-xl font-bold text-green-600">
                      {summary.compliance_percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-4">
                    Potek nošenja čelad (
                    {new Date(appliedStartDate).toLocaleDateString()} -{" "}
                    {new Date(appliedEndDate).toLocaleDateString()})
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorHelmets" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" vertical={false} />

                      <XAxis
                        dataKey="formattedTime"
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />

                      <YAxis allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: "8px" }} />
                      <Legend verticalAlign="top" height={36} />

                      <Area
                        type="monotone"
                        dataKey="totalPersons"
                        // Legenda se prilagodi glede na APPLIED datume
                        name={appliedStartDate === appliedEndDate ? "Osebe (trenutno)" : "Osebe (vsota zaznav)"}
                        stroke="#94a3b8"
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                      />

                      <Area
                        type="monotone"
                        dataKey="helmetsOn"
                        name={appliedStartDate === appliedEndDate ? "S čelado" : "S čelado (vsota zaznav)"}
                        stroke="#16a34a"
                        fillOpacity={1}
                        fill="url(#colorHelmets)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        );

      default:
        return <p>Ni podatkov za izbrano statistiko.</p>;
    }
  };

  if (error) {
    return <div className="p-16 text-red-600">Napaka: {error}</div>;
  }
  
  return (
    <div className="p-16 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Statistika rudnikov</h1>

      <div className="mb-8 flex flex-wrap gap-2 items-center justify-center">
        {menuOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => setSelectedStat(option.key)}
            className={`px-4 py-2 rounded-3xl border transition ${
              selectedStat === option.key
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-blue-500 border-blue-500 hover:bg-blue-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">{renderStat()}</div>
    </div>
  );
}

export default Stats;