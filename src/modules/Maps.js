import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Circle, InfoWindow } from '@react-google-maps/api';
import proj4 from 'proj4';
import OurModal from '../components/OurModal';
import OurButton from '../components/OurButton';
import DrawIcon from '@mui/icons-material/Draw';
import EditOffIcon from '@mui/icons-material/EditOff';

// Za transformacijo točk
proj4.defs("EPSG:3794", "+proj=tmerc +lat_0=45.1 +lon_0=15 +k=0.9999 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
const transformCoords = (e, n) => {
  if (!e?.["$numberDecimal"] || !n?.["$numberDecimal"]) return null;
  const [lng, lat] = proj4("EPSG:3794", "WGS84", [parseFloat(e["$numberDecimal"]), parseFloat(n["$numberDecimal"])]);
  return { lat, lng };
};

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

  // Za rudnike
  const [mines, setMines] = useState([]);

  // Za riasnje oz. DrawingManager
  const [drawingMode, setDrawingMode] = useState(null);
  const [polygonPath, setPolygonPath] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const drawingManagerRef = useRef(null);
  const mapRef = useRef(null);

  // Api google zemlejvid
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['drawing'],
  });

  // mapa info
  const [clickedIndex, setClickedIndex] = useState(null);

  // Pridobivanje rudnikov
  useEffect(() => {
    const fetchMines = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8080/`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const minesArray = Object.values(data);
        setMines(minesArray);
      } catch (error) {
        console.error('Error fetching mines:', error);
      }
    };

    fetchMines();
  }, []);

  // DrawingManager
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
          mines.map((circle, index) => {
            const coords = transformCoords(circle.E, circle.N);
            if (!coords) return null;

            return (
              <React.Fragment key={index}>
                <Circle
                  center={coords}
                  radius={500}
                  options={{
                    strokeColor: "#000",
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillColor: "blue",
                    fillOpacity: 0.2,
                  }}
                  onClick={() => setClickedIndex(index)}
                />

                {clickedIndex === index && (
                  <InfoWindow
                    position={coords}
                    onCloseClick={() => setClickedIndex(null)}
                  >
                    <div>
                      <h3>Ime: <strong>{circle.name}</strong></h3>
                      <p>Občina: <strong>{circle.municipality}</strong></p>
                      <p>Status: <strong>{circle.status}</strong></p>
                    </div>
                  </InfoWindow>
                )}
              </React.Fragment>
            );
          })}
      </GoogleMap>

      <OurButton
        onClickDo={() => {
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
              <EditOffIcon /> Prekliči
            </span>
          ) : (
            <span>
              <DrawIcon /> Dodaj rudnik
            </span>
          )
        }
      />

      <OurModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form action="http://localhost:8080" method="POST" className="p-6 space-y-4 text-sm">
          <h2 className="text-xl font-bold mb-4">Dodaj rudnik</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <label className="w-36">Ime rudnika:</label>
              <input name="name" className="flex-1 p-1 bg-gray-100" type="text" required />
            </div>

            <div className="flex items-center">
              <label className="w-36">Občina:</label>
              <input name="municipality" className="flex-1 p-1 bg-gray-100" type="text" />
            </div>

            <div className="flex items-center">
              <label className="w-36">Status:</label>
              <input name="status" className="flex-1 p-1 bg-gray-100" type="text" />
            </div>

            <div className="flex items-center">
              <label className="w-36">Način izkopa:</label>
              <input name="excavationMethod" className="flex-1 p-1 bg-gray-100" type="text" />
            </div>

            <div className="flex items-center">
              <label className="w-36">Začetek izkopa:</label>
              <select name="excavationStart" className="flex-1 p-1 bg-gray-100">
                {Array.from({ length: 2050 - 1900 + 1 }, (_, i) => 1900 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="w-36">Konec izkopa:</label>
              <select name="excavationEnd" className="flex-1 p-1 bg-gray-100">
                {Array.from({ length: 2050 - 1900 + 1 }, (_, i) => 1900 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="w-36">Glavna ruda:</label>
              <input name="mainOre" className="flex-1 p-1 bg-gray-100" type="text" />
            </div>

            <div className="flex items-center">
              <label className="w-36">Stranske rude:</label>
              <input name="sideOres" className="flex-1 p-1 bg-gray-100" type="text" />
            </div>

            <div className="flex items-center">
              <label className="w-36">Mineral:</label>
              <input name="mineral" className="flex-1 p-1 bg-gray-100" type="text" />
            </div>

            <div className="flex items-center">
              <label className="w-36">Raba:</label>
              <input name="usage" className="flex-1 p-1 bg-gray-100" type="text" />
            </div>

            <div className="flex items-center">
              <label className="w-36">Končna uporaba:</label>
              <input name="endUsage" className="flex-1 p-1 bg-gray-100" type="text" />
            </div>

            <div className="flex items-center">
              <label className="w-36">Vrsta kamnine:</label>
              <input name="rockType" className="flex-1 p-1 bg-gray-100" type="text" />
            </div>

            <div className="col-span-2">
              <label className="block mb-1">Zaloge rude:</label>
              <textarea name="oreSupplies" className="w-full p-2 bg-gray-100" rows="2" />
            </div>

            <div className="flex items-center">
              <label className="w-36">Rudnik rude?</label>
              <div className="flex gap-4">
                <label><input type="radio" name="oreDeposit" value="true" /> Da</label>
                <label><input type="radio" name="oreDeposit" value="false" /> Ne</label>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-36">Rudnik premoga?</label>
              <div className="flex gap-4">
                <label><input type="radio" name="coalMine" value="true" /> Da</label>
                <label><input type="radio" name="coalMine" value="false" /> Ne</label>
              </div>
            </div>
          </div>

          <input type="hidden" name="geometry" value={JSON.stringify(polygonPath)} />

          <div className="flex justify-end gap-2 pt-4">
            <OurButton
              onClickDo={() => {
                setIsModalOpen(false);
                stopDrawing();
              }}
              variant="blue"
              text="Shrani"
              classNameProps="mr-2"
              type="submit"
            />
            <OurButton
              onClickDo={() => {
                setIsModalOpen(false);
                stopDrawing();
              }}
              text="Prekliči"
            />
          </div>
        </form>
      </OurModal>
    </div>
  );
}

export default Maps;