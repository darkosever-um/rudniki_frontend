import OurModal from "../components/OurModal";
import OurButton from "../components/OurButton";
import { useContext, useState } from "react";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { mineStatuses, mineTypes, mineralGrades, infrastructureStatus, workerTypes, mineralNames } from "../constants/MineEnum.js";
import { UserContext } from '../userContext';

const AddMineModal = ({ isOpen, onClose, polygonPath, stopDrawing }) => {

  /* Uvoz konteksta uporabnika za pridobitev lastnika rudnika */
  const userContext = useContext(UserContext);

  /* Stanje za minerale, infrastrukturo in delavce */
  const [minerals, setMinerals] = useState([]);
  const [infrastructures, setInfrastructures] = useState([]);
  const [workers, setWorkers] = useState([]);

  /* Funkcije za dodajanje novih mineralov, infrastrukture in delavcev */
  const addMineral = () => {
    setMinerals([...minerals, { name: 0, min: null, max: null, grade: 0 }]);
  };
  const addInfrastructure = () => {
    setInfrastructures([...infrastructures, { IDNumber: null, status: 0, brand: "", model: "", avgFuelConsumption: null, lastMaintenance: null, operatingHours: null, kilometer: null }]);
  };
  const addWorker = () => {
    setWorkers([...workers, { IDNumber: null, firstName: "", lastName: "", birthDate: null, type: 0, salary: null }]);
  };

  /* Funkcije za posodabljanje mineralov, infrastrukture in delavcev */
  const updateMineral = (index, field, value) => {
    const newMinerals = [...minerals];
    newMinerals[index][field] = value;
    setMinerals(newMinerals);
  };
  const updateInfrastructure = (index, field, value) => {
    const newInfra = [...infrastructures];
    newInfra[index][field] = value;
    setInfrastructures(newInfra);
  };
  const updateWorker = (index, field, value) => {
    const newWorkers = [...workers];
    newWorkers[index][field] = value;
    setWorkers(newWorkers);
  };

  /* Funkcija za obdelavo oddaje obrazca */
  const handleSubmit  = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.geometry = JSON.parse(data.geometry);
    data.minerals = minerals;
    data.infrastructure = infrastructures;
    data.workers = workers;
    data.ownerId = userContext.user;

    // Rudnikov status in tip pretvorimo v števila
    data.status = parseInt(data.status);
    data.type = parseInt(data.type);
    
    // Pretvorva posebnih polj v pravilne tipe
    data.minerals = minerals.map(m => ({
      name: parseInt(m.name),
      min: Number(parseFloat(m.min).toFixed(2)),
      max: Number(parseFloat(m.max).toFixed(2)),
      grade: parseInt(m.grade),
    }));
    data.infrastructure = infrastructures.map(i => ({
      ...i,
      IDNumber: parseInt(i.IDNumber),
      lastMaintenance: i.lastMaintenance ? new Date(i.lastMaintenance).getTime() : null,
      status: parseInt(i.status),
      operatingHours: Number(parseFloat(i.operatingHours).toFixed(2)),
      avgFuelConsumption: Number(parseFloat(i.avgFuelConsumption).toFixed(2)),
      kilometer: Number(parseFloat(i.kilometer).toFixed(2))
    }));
    data.workers = workers.map(w => ({
      ...w,
      IDNumber: parseInt(w.IDNumber),
      birthDate: w.birthDate ? new Date(w.birthDate).getTime() : null,
      type: parseInt(w.type),
      salary: Number(parseFloat(w.salary).toFixed(2))
    }));

    // Pošiljanje podatkov na strežnik
    try {
      const response = await fetch("http://127.0.0.1:8080/mine/save", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
      });

      if (!response.ok) {
          throw new Error(`Napaka pri pošiljanju podatkov: ${response.statusText}`);
      }

      // const result = await response.json();
      stopDrawing();
      onClose();
    } catch (error) {
      console.error("Napaka med pošiljanjem podatkov:", error);
    }

    // Zapri modal in ustavi risanje
    stopDrawing();
    onClose();
  };

  return (
    <OurModal isOpen={isOpen} onClose={onClose} addClassName="w-[70%]">
      <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm overflow-auto max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Dodaj rudnik</h2>

        {/* Ime rudnika */}
        <div className="space-y-1">
          <label className="block font-semibold">Ime rudnika:</label>
          <input name="name" type="text" placeholder="Ime rudnika" required className="w-full p-1 bg-gray-100" />
        </div>

        {/* Občina rudnika */}
        <div className="space-y-1">
          <label className="block font-semibold">Ime rudnika:</label>
          <input name="municipality" type="text" placeholder="Občina" required className="w-full p-1 bg-gray-100" />
        </div>

        {/* Rudnikov status */}
        <div className="space-y-1">
          <label className="block font-semibold">Rudnikov status:</label>
          <select name="status" className="w-full p-1 bg-gray-100" required>
            {mineStatuses.map((s, idx) => (
              <option key={s} value={idx}>{s}</option>
            ))}
          </select>
        </div>

        {/* Tip rudnika */}
        <div className="space-y-1">
          <label className="block font-semibold">Tip rudnika:</label>
          <select name="type" className="w-full p-1 bg-gray-100" required>
            {mineTypes.map((t, idx) => (
              <option key={t} value={idx}>{t}</option>
            ))}
          </select>
        </div>

        {/* Minerali - razširljive sekcije */}
        <div>
          <label className="block font-semibold mb-1">Minerali:</label>
          {minerals.map((mineral, i) => (
            <details key={i} className="mb-2 border rounded p-2 bg-gray-50" open={i === minerals.length - 1}>
              <summary className="cursor-pointer font-semibold">Mineral {i + 1}</summary>
              <div className="space-y-2 mt-2">
                <div>
                  <label className="block">Ime:</label>
                  <select
                    value={mineral.name}
                    onChange={(e) => updateMineral(i, "name", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  >
                    {mineralNames.map((grade, idx) => (
                      <option key={grade} value={idx}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block">Minimalna zaloga:</label>
                  <input
                    type="number"
                    step={0.01}
                    placeholder="Min zaloga"
                    value={mineral.min}
                    onChange={(e) => updateMineral(i, "min", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block">Maksimalna zaloga:</label>
                  <input
                    type="number"
                    step={0.01}
                    placeholder="Max zaloga"
                    value={mineral.max}
                    onChange={(e) => updateMineral(i, "max", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block">Ocena:</label>
                  <select
                    value={mineral.grade}
                    onChange={(e) => updateMineral(i, "grade", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  >
                    {mineralGrades.map((grade, idx) => (
                      <option key={grade} value={idx}>{grade}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setMinerals(minerals.filter((_, idx) => idx !== i))}
                  className="text-red-500 font-bold"
                >
                  <HighlightOffIcon />
                </button>
              </div>
            </details>
          ))}
          <button
            type="button"
            onClick={addMineral}
            className="mt-1 px-3 py-1 bg-blue-600 text-white rounded"
          >
            Dodaj mineral
          </button>
        </div>

        {/* Infrastruktura - razširljive sekcije */}
        <div>
          <label className="block font-semibold mb-1 mt-4">Infrastruktura:</label>
          {infrastructures.map((infra, i) => (
            <details key={i} className="mb-2 border rounded p-2 bg-gray-50" open={i === infrastructures.length - 1}>
              <summary className="cursor-pointer font-semibold">Infrastruktura {i + 1}</summary>
              <div className="space-y-2 mt-2">
                <div>
                  <label className="block">ID Številka:</label>
                  <input
                    type="number"
                    placeholder="ID Številka"
                    step={1}
                    value={infra.IDNumber}
                    onChange={(e) => updateInfrastructure(i, "IDNumber", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block">Status:</label>
                  <select
                    value={infra.status}
                    onChange={(e) => updateInfrastructure(i, "status", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  >
                    {infrastructureStatus.map((t, idx) => (
                      <option key={t} value={idx}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block">Znamka:</label>
                  <input
                    type="text"
                    placeholder="Znamka"
                    value={infra.brand}
                    onChange={(e) => updateInfrastructure(i, "brand", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block">Model:</label>
                  <input
                    type="text"
                    placeholder="Model"
                    value={infra.model}
                    onChange={(e) => updateInfrastructure(i, "model", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block">Povprečna poraba goriva:</label>
                  <input
                    type="number"
                    step={0.01}
                    placeholder="Pov. poraba goriva"
                    value={infra.avgFuelConsumption}
                    onChange={(e) => updateInfrastructure(i, "avgFuelConsumption", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block">Zadnje vzdrževanje:</label>
                  <input
                    type="date"
                    placeholder="Zadnje vzdrževanje"
                    value={infra.lastMaintenance}
                    onChange={(e) => updateInfrastructure(i, "lastMaintenance", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block">Kilometri:</label>
                  <input
                    type="number"
                    step={0.01}
                    placeholder="Kilometri"
                    value={infra.kilometer}
                    onChange={(e) => updateInfrastructure(i, "kilometer", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block">Delovne ure:</label>
                  <input
                    type="number"
                    step={0.01}
                    placeholder="Delovne ure"
                    value={infra.operatingHours}
                    onChange={(e) => updateInfrastructure(i, "operatingHours", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setInfrastructures(infrastructures.filter((_, idx) => idx !== i))}
                  className="text-red-500 font-bold"
                >
                  <HighlightOffIcon />
                </button>
              </div>
            </details>
          ))}
          <button
            type="button"
            onClick={addInfrastructure}
            className="mt-1 px-3 py-1 bg-blue-600 text-white rounded"
          >
            Dodaj infrastrukturo
          </button>
        </div>

        {/* Delavci - razširljive sekcije */}
        <div>
          <label className="block font-semibold mb-1 mt-4">Delavci:</label>
          {workers.map((worker, i) => (
            <details key={i} className="mb-2 border rounded p-2 bg-gray-50" open={i === workers.length - 1}>
              <summary className="cursor-pointer font-semibold">Delavec {i + 1}</summary>
              <div className="space-y-2 mt-2">
                <div>
                  <label className="block">ID Številka:</label>
                  <input
                    type="number"
                    placeholder="ID Številka"
                    step={1}
                    value={worker.IDNumber}
                    onChange={(e) => updateWorker(i, "IDNumber", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block">Ime:</label>
                  <input
                    type="text"
                    placeholder="Ime"
                    value={worker.firstName}
                    onChange={(e) => updateWorker(i, "firstName", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block">Priimek:</label>
                  <input
                    type="text"
                    placeholder="Priimek"
                    value={worker.lastName}
                    onChange={(e) => updateWorker(i, "lastName", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block">Datum rojstva:</label>
                  <input
                    type="date"
                    placeholder="Datum rojstva"
                    value={worker.birthDate}
                    onChange={(e) => updateWorker(i, "birthDate", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  />
                </div>
                <div>
                  <label className="block">Pozicija:</label>
                  <select
                    value={worker.type}
                    onChange={(e) => updateWorker(i, "type", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  >
                    {workerTypes.map((t, idx) => (
                      <option key={t} value={idx}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block">Plača:</label>
                  <input
                    type="number"
                    step={0.01}
                    placeholder="Plača"
                    value={worker.salary}
                    onChange={(e) => updateWorker(i, "salary", e.target.value)}
                    className="w-full p-1 bg-gray-100"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setWorkers(workers.filter((_, idx) => idx !== i))}
                  className="text-red-500 font-bold"
                >
                  <HighlightOffIcon />
                </button>
              </div>
            </details>
          ))}
          <button
            type="button"
            onClick={addWorker}
            className="mt-1 px-3 py-1 bg-blue-600 text-white rounded"
          >
            Dodaj delavca
          </button>
        </div>

        <input type="hidden" name="geometry" value={JSON.stringify(polygonPath)} />

        <div className="flex justify-end gap-2 pt-4">
          <OurButton variant="blue" text="Shrani" type="submit" />
          <OurButton onClickDo={() => { stopDrawing(); onClose(); }} text="Prekliči" />
        </div>
      </form>
    </OurModal>
  );
};

export default AddMineModal;