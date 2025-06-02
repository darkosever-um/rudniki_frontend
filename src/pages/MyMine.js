import React, { useEffect, useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';

function MyMine() {
    //const navigate = useNavigate();
    const [mines, setMines] = useState([]);
    const [error, setError] = useState(null);
    const userContext = useContext(UserContext);
    const id = userContext.user;

    useEffect(() => {
        const fetchMine = async () => {
            try {
            const res = await fetch(`http://127.0.0.1:8080/user/mines/6834db78f40c18f6bc0cde01`); // ${id}
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            console.log('Mines fetched:', data);
            setMines([data]);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMine();
    }, [userContext.user, id]);

    if (error) return <div className="p-16 text-red-600">Napaka: {error}</div>;
    if (!mines) return <div className="p-16">Nalaganje podatkov...</div>;

    return (
        <div className="p-16 max-w-3xl mx-auto">
            {mines.length > 0 ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Moji rudniki</h1>
                    <ul className="list-disc pl-5">
                        {mines.map((mine) => (
                            <li key={mine._id.$oid} className="mb-2">
                                <a href={`/Mine/${mine._id.$oid}`} className="text-blue-600 hover:underline">
                                    {mine.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-gray-600">Nimate nobenega rudnika.</div>
            )}
        </div>
    );
}

export default MyMine;