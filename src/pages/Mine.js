import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OurButton from '../components/OurButton';

function Mine() {
  const { id } = useParams();
  const [mine, setMine] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const res = await fetch(`http://localhost:8080/mine/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setMine(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMine();
  }, [id]);

  if (error) return <div className="p-16 text-red-600">{id} Napaka: {error}</div>;
  if (!mine) return <div className="p-16">Nalaganje podatkov...</div>;

  return (
    <div className="p-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Statistika rudnika</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Stat label="Ime rudnika" value={mine.name} />
        <Stat label="Občina" value={mine.municipality} />
        <Stat label="Status" value={mine.status} />
        <Stat label="Globina" value={`${mine.depth || 'ni podatka'} m`} />
        <Stat label="Vrsta rude" value={mine.oreType || 'ni podatka'} />
        <Stat label="Letna proizvodnja" value={mine.productionVolume ? `${mine.productionVolume} ton` : 'ni podatka'} />
        <Stat label="Varnost" value={mine.safetyStatus || 'ni podatka'} />
        <Stat label="Datum vnosa" value={mine.createdAt ? new Date(mine.createdAt).toLocaleDateString() : 'ni podatka'} />
      </div>

      <OurButton
        text="Nazaj na zemljevid"
        onClickDo={() => navigate('/')}
        classNameProps="bg-blue-500 text-white px-4 py-2 rounded"
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

export default Mine;