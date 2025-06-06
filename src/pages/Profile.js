import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../userContext';
import OurButton from '../components/OurButton';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    const id = userContext.user;

    if (!id) navigate("/login");

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [update, setUpdate] = useState(null);
    const [editFields, setEditFields] = useState({
        username: '',
        email: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:8080/user/${id}`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setUser(data);
                console.log(data);
                setEditFields({
                    username: data.username,
                    email: data.email,
                });
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();
    }, [userContext.user, id, update]);

    const handleSave = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8080/user/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user._id.$oid,
                    username: editFields.username,
                    email: editFields.email,
                }),
            });

            if (!res.ok) throw new Error(`Napaka pri shranjevanju: ${res.status}`);
            const updated = await res.json();
            setUser(updated);
            setEditMode(false);
            setUpdate(Date.now())
        } catch (err) {
            console.error('Napaka pri shranjevanju profila:', err);
        }
    };

    if (error) return <div className="p-16 text-red-600">Napaka: {error}</div>;
    if (!user) return <div className="p-16">Nalaganje podatkov...</div>;

    return (
        <div className="p-16 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Profil uporabnika</h1>
            {editMode ? (
                <>
                    <div className="mb-4">
                        <label className="block font-semibold">Uporabniško ime</label>
                        <input
                            type="text"
                            value={editFields.username}
                            onChange={(e) => setEditFields({ ...editFields, username: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-semibold">Email</label>
                        <input
                            type="email"
                            value={editFields.email}
                            onChange={(e) => setEditFields({ ...editFields, email: e.target.value })}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div className="flex gap-2">
                        <OurButton onClickDo={handleSave} text="Shrani" variant='blue' />
                        <OurButton
                            onClickDo={() => {
                                setEditMode(false);
                                setEditFields({ username: user.username, email: user.email });
                            }}
                            text="Prekliči"
                            className="bg-gray-300 text-black hover:bg-gray-400"
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-2">
                        <strong>Uporabniško ime:</strong> {user.username}
                    </div>
                    <div className="mb-2">
                        <strong>Email:</strong> {user.email}
                    </div>
                    <div className="mb-2">
                        <strong>Rojen:</strong> {user.birthDate ? new Date(user.birthDate.$date).toLocaleString() : 'neznano'}
                    </div>
                    <div className="mb-2">
                        <strong>Število rudnikov:</strong> {user.mines ? user.mines.length : 0}
                    </div>
                    <div className="mb-2">
                        <strong>Datum registracije:</strong> {user.created ? new Date(user.created.$date).toLocaleString() : 'neznano'}
                    </div>
                    <OurButton
                        onClickDo={() => setEditMode(true)}
                        text="Uredi profil"
                        className="mt-4"
                    />
                    <p>-</p>
                    <OurButton
                        onClickDo={() => navigate('/LogOut')}
                        className="mt-4 ml-2"
                        text="Odjava"
                        variant="red"
                    />
                </>
            )}
        </div>
    );
}

export default Profile;