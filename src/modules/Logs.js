import { useEffect, useState } from "react";
import { mineralNames } from "../constants/MineEnum.js";

function Logs({mineId, update}) {
    const [history, setHistory] = useState([{}]);

    useEffect(() => {
        if (!mineId) return;

        const timeout = setTimeout(() => {
            const fetchHistory = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8080/mine/history/${mineId}`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setHistory(Object.values(data).reverse());
            } catch (err) {
                console.error(err.message);
            }
            };

            fetchHistory();
        }, 300);

        return () => clearTimeout(timeout);
        }, [mineId, update]);

    return (
        <div>
            <h2 className="text-xl font-bold text-center mt-6">Zgodovina dnevnih izkopov</h2>
            <ul className="space-y-4">
                {history && history.length > 1 ? history.map((day, index) => (
                    <li
                    key={index}
                    className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
                    >
                    <div className="text-sm text-gray-500 mb-2">
                        Datum:{" "}
                        <span className="font-medium text-gray-800">
                        {new Date(day.day).toLocaleDateString("sl-SI", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-gray-700 font-semibold mb-2">Minerali:</h3>
                        <ul className="pl-4 list-disc space-y-1">
                        {day.minerals && day.minerals.map((mineral, i) => (
                            <div key={i} className="text-gray-600">
                            <span className="font-medium text-gray-800">{mineralNames[mineral.name]}</span>{", "}
                            količina:{" "}
                            <span className="font-semibold">{mineral.quantity}</span>
                            </div>
                        ))}
                        </ul>
                    </div>
                    </li>
                )) : "Ni vpisov."}
                </ul>
        </div>
    );
}

export default Logs;