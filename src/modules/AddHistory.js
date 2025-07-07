import OurButton from "../components/OurButton";
import { useState } from "react";
import { mineralNames } from "../constants/MineEnum.js";
import { useNotification } from '../notificationContext';

function AddHistory({minerals, mineId, setUpdateLog}) {
  const [quantities, setQuantities] = useState([]);
  const { addNotification } = useNotification();

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
        addNotification({
            type: 'notification',
            title: 'Nov log',
            text: 'Uspešno si dodal log za tekoči dan.',
          });
        setUpdateLog(Date.now())
      } else {
        addNotification({
            type: 'alert',
            title: 'Napaka',
            text: 'Težava pri dodajanju log-a.',
          });
        console.log(response)
      }
    } catch (error) {
      console.error('Napaka pri pošiljanju:', error);
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
        variant="blue"
        type="button"
      />
    </div>
  );
}

export default AddHistory;