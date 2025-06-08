import OurButton from "../components/OurButton";
import { useContext, useEffect, useState } from "react";
import { mineralNames } from "../constants/MineEnum.js";

function Logs({mineId}) {
    const [history, setHistory] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            console.log(`http://127.0.0.1:8080/mine/history/${mineId}`)
          try {
            const res = await fetch(`http://127.0.0.1:8080/mine/history/${mineId}`
            );
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setHistory(Object.values(data));
            console.log(Object.values(data));
          } catch (err) {
            console.error(err.message);
          }
        };
        fetchHistory();
    }, [mineId]);

    useEffect(() => {console.log(history)}, [history])

    return (
    <div>
        <p>Log</p>
        <ul>
            <li>xxxx</li>
            {history !== null ?? (history.map((dan, index) => {
                <li key={index}>
                    tekst
                    {dan.day}
                </li>
            }))}
        </ul>
    </div>
    );
}

export default Logs;