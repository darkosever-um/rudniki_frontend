import OurButton from "../components/OurButton";
import { useContext, useEffect, useState } from "react";
import Clear from '@mui/icons-material/Clear';
import Save from '@mui/icons-material/Save';
import { mineralNames } from "../constants/MineEnum.js";
import { UserContext } from '../userContext';

function AddHistory({minerals, mineId}) {
  const [quantities, setQuantities] = useState([]);

  console.log(mineId)


  const handleChange = (mineral, value) => {
    setQuantities((prev) => {
      const existing = prev.find((m) => m.name === mineral.name);
      if (existing) {
        return prev.map((m) =>
          m.name === mineral.name ? { ...m, quantity: parseFloat(value) } : m
        );
      } else {
        return [...prev, { name: mineral.name, quantity: parseFloat(value) }];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/mine/addHistory/${mineId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ minerals: quantities }),
      });

      if (response.ok) {
        alert('Podatki uspešno poslani!');
      } else {
        alert('Napaka pri pošiljanju.');
      }
    } catch (error) {
      console.error('Napaka pri pošiljanju:', error);
      alert('Napaka pri pošiljanju.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow rounded-2xl space-y-4">
      <h2 className="text-xl font-bold text-center">Vnos količine</h2>
      <p>Vnos količine mineralov za aktivni dan</p>
      {minerals.map((mineral, index) => (
        <div key={index} className="flex items-center justify-between">
          <label className="text-gray-700 font-medium">{mineralNames[mineral.name]}</label>
          <input
            type="number"
            min="0"
            onChange={(e) => handleChange(mineral, e.target.value)}
            value={quantities.find((q) => q.name === mineral.name)?.quantity || ''}
            className="border border-gray-300 rounded-lg px-2 py-1 text-right"
          />
        </div>
      ))}
      <OurButton
        onClickDo={handleSubmit}
        text="Shrani"
        classNameProps="w-full"
      />
    </div>
  );
}

export default AddHistory;