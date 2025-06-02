import OurModal from "../components/OurModal";
import OurButton from "../components/OurButton";
import { useContext, useState } from "react";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { mineStatuses, mineTypes, mineralGrades, infrastructureStatus, workerTypes, mineralNames } from "../constants/MineEnum.js";
import { UserContext } from '../userContext';

const AddMineModal = ({ isOpen, onClose, polygonPath, stopDrawing }) => {

  // uporabnik
  const userContext = useContext(UserContext);

  console.log("Dodaj rudnik modal, polygonPath:", polygonPath);

  const [minerals, setMinerals] = useState([]);
  const [infrastructures, setInfrastructures] = useState([]);
  const [workers, setWorkers] = useState([]);

    const addMineral = () => {
        setMinerals([...minerals, { name: "", min: "", max: "", grade: mineralGrades[0] }]);
    };
    const addInfrastructure = () => {
        setInfrastructures([...infrastructures, { status: infrastructureStatus[0], brand: "", model: "", avgFuelConsumption: "", lastMaintenance: "", operatingHours: "", kilometer: "" }]);
    };
    const addWorker = () => {
        setWorkers([...workers, { firstName: "", lastName: "", birthDate: "", type: workerTypes[0], salary: "" }]);
    };

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

    const handleSubmit  = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.geometry = JSON.parse(data.geometry);
        data.minerals = minerals;
        data.infrastructure = infrastructures;
        data.workers = workers;
        //data.ownerId = userContext.user._id;
        data.ownerId = "86f2ac31ed9b45919d3decfb";

        // iz string v int
        data.status = parseInt(data.status);
        data.type = parseInt(data.type);
        data.minerals = minerals.map(m => ({
          name: parseInt(m.name),
          min: m.min,
          max: m.max,
          grade: parseInt(m.grade),
        }));
        data.infrastructure = infrastructures.map(i => ({
          ...i,
          lastMaintenance: i.lastMaintenance ? new Date(i.lastMaintenance).getTime() : null,
          status: parseInt(i.status)
        }));
        data.workers = workers.map(w => ({
          ...w,
          birthDate: new Date(w.birthDate).getTime(),
          type: parseInt(w.type)
        }));

        console.log("Oddani podatki rudnika:", data);

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

            const result = await response.json();
            console.log("Shranjeno:", result);

            stopDrawing();
            onClose();
        } catch (error) {
            console.error("Napaka med pošiljanjem podatkov:", error);
        }

        stopDrawing();
        onClose();
    };

  return (
    <OurModal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm overflow-auto max-h-[80vh]">

        <h2 className="text-xl font-bold mb-4">Dodaj rudnik</h2>

        {/* Ime rudnika */}
        <div className="flex items-center gap-4">
          <label className="w-36">Ime rudnika:</label>
          <input name="name" type="text" required className="flex-1 p-1 bg-gray-100" />
        </div>

        {/* Rudnikov status */}
        <div className="flex items-center gap-4">
            <label className="w-36">Rudnikov status:</label>
            <select name="status" className="flex-1 p-1 bg-gray-100" required>
                {mineStatuses.map((s, idx) => <option key={s} value={idx}>{s}</option>)}
            </select>
        </div>

        {/* Tip rudnika */}
        <div className="flex items-center gap-4">
          <label className="w-36">Tip rudnika:</label>
          <select name="type" className="flex-1 p-1 bg-gray-100" required>
            {mineTypes.map((t, idx) => <option key={t} value={idx}>{t}</option>)}
          </select>
        </div>

        {/* Minerali - dinamično dodajanje */}
        <div>
          <label className="block font-semibold mb-1">Minerali:</label>
          {minerals.map((mineral, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 mb-2 items-center">
              {/* <input
                type="text"
                placeholder="Ime minerala"
                value={mineral.name}
                onChange={e => updateMineral(i, "name", e.target.value)}
                className="p-1 bg-gray-100"
                required
              /> */}

              <select
                value={mineral.name}
                onChange={e => updateMineral(i, "name", e.target.value)}
                className="p-1 bg-gray-100"
                required
              >
                {mineralNames.map((grade, idx) => (
                  <option key={grade} value={idx}>{grade}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min zaloga"
                value={mineral.min}
                onChange={e => updateMineral(i, "min", e.target.value)}
                className="p-1 bg-gray-100"
                required
              />
              <input
                type="number"
                placeholder="Max zaloga"
                value={mineral.max}
                onChange={e => updateMineral(i, "max", e.target.value)}
                className="p-1 bg-gray-100"
                required
              />
              <select
                value={mineral.grade}
                onChange={e => updateMineral(i, "grade", e.target.value)}
                className="p-1 bg-gray-100"
                required
              >
                {mineralGrades.map((grade, idx) => (
                  <option key={grade} value={idx}>{grade}</option>
                ))}
              </select>
              <button type="button" onClick={() => {
                setMinerals(minerals.filter((_, idx) => idx !== i));
              }} className="text-red-500 font-bold"><HighlightOffIcon/></button>
            </div>
          ))}
          <button type="button" onClick={addMineral} className="mt-1 px-3 py-1 bg-blue-600 text-white rounded">Dodaj mineral</button>
        </div>

        {/* Infrastruktura - dinamično dodajanje */}
        <div>
          <label className="block font-semibold mb-1 mt-4">Infrastruktura:</label>
          {infrastructures.map((infra, i) => (
            <div key={i} className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-2 items-center">
              <select
                value={infra.status}
                onChange={e => updateInfrastructure(i, "status", e.target.value)}
                className="p-1 bg-gray-100"
                required
              >
                {infrastructureStatus.map((t, idx) => <option key={t} value={idx}>{t}</option>)}
              </select>
              <input
                type="text"
                placeholder="Znamka"
                value={infra.brand}
                onChange={e => updateInfrastructure(i, "brand", e.target.value)}
                className="p-1 bg-gray-100"
                required
              />
              <input
                type="text"
                placeholder="Model"
                value={infra.model}
                onChange={e => updateInfrastructure(i, "model", e.target.value)}
                className="p-1 bg-gray-100"
                required
              />
              <input
                type="number"
                placeholder="Pov. poraba goriva"
                value={infra.avgFuelConsumption}
                onChange={e => updateInfrastructure(i, "avgFuelConsumption", parseFloat(e.target.value))}
                className="p-1 bg-gray-100"
              />
              <input
                type="date"
                placeholder="Zadnje vzdrževanje"
                value={infra.lastMaintenance}
                onChange={e => updateInfrastructure(i, "lastMaintenance", e.target.value)}
                className="p-1 bg-gray-100"
              />
              <input
                type="number"
                placeholder="Kilometri"
                value={infra.kilometer}
                onChange={e => updateInfrastructure(i, "kilometer", parseFloat(e.target.value))}
                className="p-1 bg-gray-100"
              />
              <input
                type="number"
                placeholder="Delovne ure"
                value={infra.operatingHours}
                onChange={e => updateInfrastructure(i, "operatingHours", parseFloat(e.target.value))}
                className="p-1 bg-gray-100"
              />
              <button type="button" onClick={() => {
                setInfrastructures(infrastructures.filter((_, idx) => idx !== i));
              }} className="text-red-500 font-bold col-span-1"><HighlightOffIcon/></button>
            </div>
          ))}
          <button type="button" onClick={addInfrastructure} className="mt-1 px-3 py-1 bg-blue-600 text-white rounded">Dodaj infrastrukturo</button>
        </div>

        {/* Delavci - dinamično dodajanje */}
        <div>
          <label className="block font-semibold mb-1 mt-4">Delavci:</label>
          {workers.map((worker, i) => (
            <div key={i} className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-2 items-center">
              <input
                type="text"
                placeholder="Ime"
                value={worker.firstName}
                onChange={e => updateWorker(i, "firstName", e.target.value)}
                className="p-1 bg-gray-100"
                required
              />
              <input
                type="text"
                placeholder="Priimek"
                value={worker.lastName}
                onChange={e => updateWorker(i, "lastName", e.target.value)}
                className="p-1 bg-gray-100"
                required
              />
              <input
                type="date"
                placeholder="Datum rojstva"
                value={worker.birthDate}
                onChange={e => updateWorker(i, "birthDate", e.target.value)}
                className="p-1 bg-gray-100"
                required
              />
              <select
                value={worker.type}
                onChange={e => updateWorker(i, "type", e.target.value)}
                className="p-1 bg-gray-100"
                required
              >
                {workerTypes.map((t, idx) => <option key={t} value={idx}>{t}</option>)}
              </select>
              <input
                type="number"
                placeholder="Plača"
                value={worker.salary}
                onChange={e => updateWorker(i, "salary", e.target.value)}
                className="p-1 bg-gray-100"
                required
              />
              <button type="button" onClick={() => {
                setWorkers(workers.filter((_, idx) => idx !== i));
              }} className="text-red-500 font-bold col-span-1"><HighlightOffIcon/></button>
            </div>
          ))}
          <button type="button" onClick={addWorker} className="mt-1 px-3 py-1 bg-blue-600 text-white rounded">Dodaj delavca</button>
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