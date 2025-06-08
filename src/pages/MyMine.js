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
            const res = await fetch(`http://127.0.0.1:8080/user/mines/${id}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            var data = await res.json();
            data = Object.values(data);
            if(data[0] === "Prijavljeni uporabnik nima rudnikov!"){
                setMines(Object.values({}));
            }else{
                setMines(Object.values(data));
            }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMine();
    }, [userContext.user, id]);

    if (error) return <div className="p-16 text-red-600">Napaka: {error}</div>;
    if (!mines) return <div className="p-16">Nalaganje podatkov...</div>;

    return (
        <div className="p-8 mt-16 max-w-6xl mx-auto">
            {mines.length > 0 ? (
                <div>
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Moji rudniki</h1>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {mines.map((mine) => (
                    <a
                        key={mine._id.$oid}
                        href={`/Mine/${mine._id.$oid}`}
                        className="block bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition duration-300"
                    >
                        <div className="mb-2 text-xl font-semibold text-gray-700 group-hover:text-blue-700">
                        {mine.name}
                        </div>
                        <p className="text-sm text-gray-500">
                        Klikni za ogled podrobnosti o rudniku →
                        </p>
                    </a>
                    ))}
                </div>
                </div>
            ) : (
                <div className="text-gray-600 text-center mt-20 text-lg">
                Nimate nobenega rudnika.
                </div>
            )}
            </div>
    );
}

export default MyMine;