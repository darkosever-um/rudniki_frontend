import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow, Polygon } from '@react-google-maps/api';
import OurButton from '../components/OurButton';
import DrawIcon from '@mui/icons-material/Draw';
import EditOffIcon from '@mui/icons-material/EditOff';
import AddMineModal from './AddMineModal';

const libraries = ['drawing'];

// Za zemljevid
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
  zoomControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

function Maps() {
  // Hramba rudnikov
  const [mines, setMines] = useState([]);

  // RISANJE, DrawingManager
  const [drawingMode, setDrawingMode] = useState(null);
  const [polygonPath, setPolygonPath] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const drawingManagerRef = useRef(null);
  const mapRef = useRef(null);

  // API google zemlejvid
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // MAPA INFO
  const [clickedIndex, setClickedIndex] = useState(null);

  // FETCH, Pridobivanje rudnikov
  useEffect(() => {
    const fetchMines = async () => {
      try {
        const res = await fetch(`http://localhost:8080/mine/`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const minesArray = Object.values(data);
        setMines(minesArray);
        console.log('Mines fetched:', minesArray);
      } catch (error) {
        console.error('Error fetching mines:', error);
      }
    };

    fetchMines();
  }, []);

  function calculateCentroid(path) {
    let latSum = 0;
    let lngSum = 0;
    let len = path.length;

    for (let i = 0; i < len; i++) {
      latSum += path[i].lat;
      lngSum += path[i].lng;
    }

    return {
      lat: latSum / len,
      lng: lngSum / len,
    };
  }

  // RISANJE, DrawingManager
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    if (!drawingManagerRef.current) {
      drawingManagerRef.current = new window.google.maps.drawing.DrawingManager({
        drawingControl: false,
        polygonOptions: {
          fillColor: 'blue',
          fillOpacity: 0.3,
          strokeWeight: 1,
          strokeOpacity: 0.8,
          clickable: false,
          editable: false,
          zIndex: 1,
        },
        drawingMode: null,
        map: mapRef.current,
      });

      // Listener -> da konča risanje
      drawingManagerRef.current.addListener('polygoncomplete', (polygon) => {
        const path = polygon.getPath().getArray().map((latlng) => ({
          lat: latlng.lat(),
          lng: latlng.lng(),
        }));
        console.log('Poligon dokončan:', path);
        setPolygonPath(path);
        setIsModalOpen(true);
        //polygon.setMap(null); // Odstrani poligon z zemljevida
        stopDrawing();
      });
    }

    drawingManagerRef.current.setDrawingMode(drawingMode);

    return () => {
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(null);
        drawingManagerRef.current = null;
      }
    };
  }, [isLoaded, drawingMode]);
  const stopDrawing = () => {
    setDrawingMode(null);
    setPolygonPath([]);
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={9}
        options={options}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {mines &&
          mines.map((mine, index) => {
            const geometry = mine.geometry?.[0]?.geometry;
            const polygonCoords = geometry?.coordinates?.[0]?.map(coord => ({
              lng: coord[0],
              lat: coord[1]
            })) || [];

            const centroid = polygonCoords.length > 0
              ? calculateCentroid(polygonCoords)
              : { lat: mine.lat, lng: mine.lon };

            return (
              <React.Fragment key={index}>
                {/* Poligon */}
                {polygonCoords.length > 0 && (
                  <Polygon
                    path={polygonCoords}
                    options={{
                      fillColor: 'blue',
                      fillOpacity: 0.3,
                      strokeWeight: 1,
                      strokeOpacity: 0.8,
                      clickable: true,
                      editable: false,
                      zIndex: 1,
                    }}
                    onClick={() => setClickedIndex(index)}
                  />
                )}

                {/* InfoWindow na centroidu */}
                {clickedIndex === index && (
                  <InfoWindow
                    position={centroid}
                    onCloseClick={() => setClickedIndex(null)}
                  >
                    <div>
                      <h3>Ime: <strong>{mine.name}</strong></h3>
                      <p>Občina: <strong>{mine.municipality}</strong></p>
                      <p>Status: <strong>{mine.status}</strong></p>
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            );
          })}
      </GoogleMap>

      <OurButton
        disabled={(isModalOpen)}
        
        onClickDo={() => {
          console.log(drawingManagerRef)
          if (drawingMode) {
            stopDrawing();
          } else {
            setDrawingMode('polygon');
          }
        }}
        classNameProps="absolute bottom-[25px] right-[25px] z-[1000]"
        text={
          drawingMode ? (
            <span>
              <EditOffIcon /> Končaj
            </span>
          ) : (
            <span>
              <DrawIcon /> Dodaj rudnik
            </span>
          )
        }
      />

      <AddMineModal
        isOpen={isModalOpen}
        stopDrawing={stopDrawing}
        polygonPath={polygonPath}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Maps;