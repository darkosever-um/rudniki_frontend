import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../userContext';
import OurButton from '../components/OurButton';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [error, setError] = useState(null);
    const userContext = useContext(UserContext);
    const id = userContext.user;

    useEffect(() => {
        const fetchMine = async () => {
            try {
            const res = await fetch(`http://localhost:8080/user/${id}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setUser(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMine();
    }, [userContext.user, id]);

    if (error) return <div className="p-16 text-red-600">Napaka: {error}</div>;
    if (!user) return <div className="p-16">Nalaganje podatkov...</div>;

    return (
        <div className="p-16 max-w-3xl mx-auto">
            {user ? (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Profil uporabnika</h1>
                    <div className="mb-2">
                        <strong>Uporabniško ime:</strong> {user.username}
                    </div>
                    <div className="mb-2">
                        <strong>Email:</strong> {user.email}
                    </div>
                    <div className="mb-2">
                        <strong>Število rudnikov:</strong> {user.mines ? user.mines.length : 0}
                    </div>
                    <div className="mb-2">
                        <strong>Datum registracije:</strong> {user.created ? new Date(user.created.$date).toLocaleString() : 'neznano'}
                </div>
                <OurButton
                    onClickDo={() => navigate('/LogOut')}
                    className="mt-4"
                    text="Odjava"
                    variant='red'
                />
            </div>
            ) : (
                <div className="text-gray-600">Ni podatkov o uporabniku.</div>
            )}
        </div>
    );
}

export default Profile;