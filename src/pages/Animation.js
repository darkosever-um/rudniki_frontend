import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Circle, InfoWindow } from '@react-google-maps/api';
import OurModal from '../components/OurModal';
import axios from 'axios';
import { mineralNames, mineTypes } from '../constants/MineEnum';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 46.1512,
  lng: 14.9955,
};

const options = {
  disableDefaultUI: true,
};

const LIBRARIES = ['drawing'];

function Animation() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [from, setFrom] = useState(1900);
  const [to, setTo] = useState(2025);
  const [minesByYear, setMinesByYear] = useState({});
  const [visibleMines, setVisibleMines] = useState([]);
  const [currentYear, setCurrentYear] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredMine, setHoveredMine] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8080/mine/getMinesByYear', {
        from,
        to,
      });

      const fetchedMines = Object.values(response.data);

      const grouped = {};
      for (const mine of fetchedMines) {
        if (!grouped[mine.startYear]) {
          grouped[mine.startYear] = [];
        }
        grouped[mine.startYear].push(mine);
      }

      if(grouped["undefined"] === "Ni rudnikov v tem časovnem intervalu!"){
        alert("Ni rudnikov v tem časovnem intervalu!");
        setIsModalOpen(false);
        return;
      }
      
      setMinesByYear(grouped);
      setIsModalOpen(false);
      setIsAnimating(true);
    } catch (error) {
      console.error('Napaka pri pridobivanju rudnikov:', error);
    }
  };

  useEffect(() => {
    if (!isAnimating) return;

    let year = from;

    const interval = setInterval(() => {
      if (year > to) {
        clearInterval(interval);
        setIsAnimating(false);
        return;
      }

      setCurrentYear(year);

      const activeMines = [];
      for (const mines of Object.values(minesByYear)) {
        for (const mine of mines) {
          if (
            mine.startYear <= year &&
            (mine.endYear === null || mine.endYear >= year)
          ) {
            activeMines.push(mine);
          }
        }
      }

      setVisibleMines(activeMines);
      year++;
    }, 250);

    return () => clearInterval(interval);
  }, [isAnimating, from, to, minesByYear]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={8}
        options={options}
      >
        {visibleMines.map((mine, index) => (
          <Circle
            key={index}
            center={{ lat: mine.lat, lng: mine.lon }}
            radius={750}
            options={{
              strokeColor: '#000',
              strokeOpacity: 0.2,
              strokeWeight: 2,
              fillColor: '#0000FF',
              fillOpacity: 0.3,
              clickable: true,
            }}
            onMouseOver={() => setHoveredMine(mine)}
            onMouseOut={() => setHoveredMine(null)}
          />
        ))}

        {hoveredMine && (
          <InfoWindow
            position={{ lat: hoveredMine.lat, lng: hoveredMine.lon }}
            onCloseClick={() => setHoveredMine(null)}
          >
            <div className="text-sm">
              <div><strong>Ime:</strong> {hoveredMine.name}</div>
              <div><strong>Tip:</strong> {mineTypes[hoveredMine.type]}</div>
              <div><strong>Občina:</strong> {hoveredMine.municipality}</div>
              <div><strong>Minerali:</strong> {hoveredMine.minerals?.map((m) => mineralNames[m.name]).join(', ')}</div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <OurModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Izberi časovno obdobje</h2>
        <div className="flex flex-col gap-4">
          <label>
            Od:
            <input
              type="number"
              value={from}
              onChange={(e) => setFrom(parseInt(e.target.value))}
              className="border rounded px-2 py-1 w-full"
            />
          </label>
          <label>
            Do:
            <input
              type="number"
              value={to}
              onChange={(e) => setTo(parseInt(e.target.value))}
              className="border rounded px-2 py-1 w-full"
            />
          </label>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Prikaži rudnike
          </button>
        </div>
      </OurModal>

      {isAnimating && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4">
          <div className="w-full bg-blue-100 rounded-full h-4">
            <div
              className="bg-blue-400 h-4 rounded-full transition-all duration-200"
              style={{
                width: `${((currentYear - from) / (to - from)) * 100}%`,
              }}
            ></div>
          </div>
          <div className="text-center mt-1 text-black font-bold text-lg bg-white bg-opacity-60 px-2 rounded">
            {currentYear}
          </div>
        </div>
      )}
    </div>
  );
}

export default Animation;