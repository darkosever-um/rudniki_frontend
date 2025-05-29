import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OurButton from '../components/OurButton';
import OurModal from '../components/OurModal';
import Plus from '@mui/icons-material/Add';
import { infrastructureStatus, mineralGrades, mineStatuses, mineTypes, workerTypes } from "../constants/MineEnum.js";

function Mine() {
  const { id } = useParams();
  const [mine, setMine] = useState(null);
  const [update, setUpdate] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // za modal
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({ name: '', value: '' });
  const [loading, setLoading] = useState(false);

  // funkcije za modal
  const openModal = (type) => {
    setModalType(type);
    setFormData({ name: '', value: '' });
  };
  const closeModal = () => {
    setModalType(null);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      let body;
      var path;
      if (modalType === 'worker') {
        body = { id: id, workers: [formData] };
        path = '/addWorker';
      } else if (modalType === 'mineral') {
        body = { id: id, minerals: [formData] };
        path = '/addMineral';
      } else if (modalType === 'infrastructure') {
        body = { id: id, infrastructure: [formData] };
        path = '/addInfrastructure';
      }
      

      await fetch('http://localhost:8080/mine' + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      setUpdate(Date.now());
      // mordal bi posodobiti rudnikov modified

      closeModal();
    } catch (err) {
      console.error('Napaka pri pošiljanju podatkov:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMine = async () => {
      try {
        const res = await fetch(`http://localhost:8080/mine/get/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setMine(data);
        console.log('Mine data:', data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMine();
  }, [id, update]);

  if (error) return <div className="p-16 text-red-600">{id} Napaka: {error}</div>;
  if (!mine) return <div className="p-16">Nalaganje podatkov...</div>;

  return (
    <div className="p-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{mine.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Stat label="Status" value={mine.status ? mineStatuses[mine.status] : '-'} />
        <Stat label="Tip" value={mine.type ? mineTypes[mine.type] : '-'} />
        <Stat label="Minerali" value={mine.minerals ? (
          mine.minerals.length > 0 ? (
            <div>
            {mine.minerals.map((mineral, index) => (
              <div key={index} className="relative inline-block group mr-2 mb-2">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {mineral.name} ({mineral.grade ? mineralGrades[mineral.grade] : 'neznano'})
                </span>

                <div className="absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap pointer-events-none">
                  Min: {mineral.min ?? 'neznano'}, Max: {mineral.max ?? 'neznano'}
                </div>
              </div>
            ))}
            <OurButton onClickDo={() => openModal('mineral')} text={<Plus/>} classNameProps='px-1 py-0'/>
            </div>
          ): 'ni dodanih mineralov'
        ) : '-'} />
        <Stat label="Infrastruktura" value={mine.infrastructure ? (
          mine.infrastructure.length > 0 ? (
            <div>
            {mine.infrastructure.map((inf, index) => (
              <div key={index} className="relative inline-block group mr-2 mb-2">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {inf.brand} {inf.model}
                </span>

                <div className="absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap pointer-events-none">
                  Prevoženih: <strong>{inf.kilometer ?? 'neznano'}km,</strong><br/>
                  Delovnih ur: <strong>{inf.operatingHours.toFixed(2) ?? 'neznano'}</strong><br/>
                  Tip: <strong>{infrastructureStatus[inf.status] ?? 'neznano'}</strong><br/>
                </div>
              </div>
            ))}
            <OurButton onClickDo={() => openModal('infrastructure')} text={<Plus/>} classNameProps='px-1 py-0'/>
            </div>
          )
           : 'ni dodanih infrastrukturnih objektov'
        ) : '-'} />
        <Stat label="Infrastruktura" value={mine.workers ? (
          <div>
            {mine.workers.length > 0 ? (
              mine.workers.map((worker, index) => (
                <div key={index} className="relative inline-block group mr-2 mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {worker.firstName} {worker.lastName}
                  </span>

                  <div className="absolute z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap pointer-events-none">
                    naziv: <strong>{worker.type ? workerTypes[worker.type] : 'neznano'}</strong>,<br/>
                    rojen: <strong>{worker.birthDate ? new Date(worker.birthDate.$date).toLocaleDateString() : 'neznano'}</strong><br/>
                    plača: <strong>{worker.salary.toFixed(2) ?? 'neznano'} EUR</strong>
                  </div>
                </div>
              ))
            ): 'ni dodanih delavcev'}
            <OurButton onClickDo={() => openModal('worker')} text={<Plus/>} classNameProps='px-1 py-0'/>
          </div>
        ) : '-'} />
      </div>
      
      <div className="mb-8">
        {mine.modified.$date !== mine.created.$date ?
          (<p className='text-gray-400'>Rudnik spremenjen: {mine.modified ? new Date(mine.modified.$date).toLocaleString() : 'ni podatka'}</p>)
          : <p className='text-gray-400'>Rudnik še ni bil posodobljen.</p>
        }
        <p className='text-gray-400'>Rudnik dodan: {mine.created ? new Date(mine.created.$date).toLocaleString() : 'ni podatka'}</p>
        <p className='text-gray-400'>Ustvaril: {mine.ownerId ? mine.ownerId.$oid : 'ni podatka'}</p>
      </div>

      <OurButton
        text="Nazaj na zemljevid"
        onClickDo={() => navigate('/')}
        variant='blue'
      />

      <OurModal isOpen={modalType !== null} onClose={closeModal}>
        <h2 className="text-xl font-bold mb-2">
          Dodaj {modalType === 'worker' ? 'delavca' : modalType === 'mineral' ? 'mineral' : 'infrastrukturo'}
        </h2>
        <p className="text-gray-600 mb-4">
          Izpolni podatke za nov vnos.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          {modalType === 'worker' && (
            <>
              <div>
                <label className="block text-sm mb-1">Ime</label>
                <input type="text" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Priimek</label>
                <input type="text" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Datum rojstva</label>
                <input type="date" className="w-full border p-2 rounded"
                  onChange={e => {
                    const dateMillis = new Date(e.target.value).getTime();
                    setFormData(prev => ({ ...prev, birthDate: dateMillis }));
                  }} />
              </div>
              <div>
                <label className="block text-sm mb-1">ID številka</label>
                <input type="number" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, IDNumber: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Tip</label>
                <select className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, type: Number(e.target.value) }))}>
                  {workerTypes.map((type, idx) => (
                    <option key={idx} value={idx}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Plača</label>
                <input type="number" step="0.01" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, salary: parseFloat(e.target.value) }))} />
              </div>
            </>
          )}

          {modalType === 'mineral' && (
            <>
              <div>
                <label className="block text-sm mb-1">Ime minerala</label>
                <input type="text" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Min količina</label>
                <input type="number"  step="0.01" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, min: parseFloat(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Max količina</label>
                <input type="number"  step="0.01" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, max: parseFloat(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Kakovost (grade)</label>
                <select className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, grade: Number(e.target.value) }))}>
                  {mineralGrades.map((grade, idx) => (
                    <option key={idx} value={idx}>{grade}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {modalType === 'infrastructure' && (
            <>
              <div>
                <label className="block text-sm mb-1">Znamka</label>
                <input type="text" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, brand: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Model</label>
                <input type="text" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, model: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">ID številka</label>
                <input type="number" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, IDNumber: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Status</label>
                <select className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, status: Number(e.target.value) }))}>
                  {infrastructureStatus.map((status, idx) => (
                    <option key={idx} value={idx}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Poraba goriva</label>
                <input type="number" step="0.01" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, avgFuelConsumption: parseFloat(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Zadnje vzdrževanje</label>
                <input type="date" className="w-full border p-2 rounded"
                  onChange={e => {
                    const dateMillis = new Date(e.target.value).getTime();
                    setFormData(prev => ({ ...prev, lastMaintenance: dateMillis }));
                  }} />
              </div>
              <div>
                <label className="block text-sm mb-1">Delovne ure</label>
                <input type="number" step="0.01" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, operatingHours: parseFloat(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Kilometri</label>
                <input type="number"  step="0.01" className="w-full border p-2 rounded"
                  onChange={e => setFormData(prev => ({ ...prev, kilometer: Number(e.target.value) }))} />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Prekliči
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Pošiljanje...' : 'Shrani'}
            </button>
          </div>
        </form>
      </OurModal>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

export default Mine;