import './App.css';
import Maps from './modules/Maps'; 
import Nav from './modules/Nav';
import NotificationStack from './modules/NotificationStack';
import OurModal from './components/OurModal';
import { useState } from 'react';
import OurPopUp from './components/OurPopUp';
// import OurButton from './components/OurButton';

function App() {
  const [showModal, setShowModal] = useState(true);
  const [showPopUp, setShowPopUp] = useState(true);

  return (
    <div className="App">
      {/* <OurButton text={"test"} onClickDo={() => alert('Button clicked!')} variant='blue'/> */}
      
      <NotificationStack/>
      
      <OurModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-xl font-semibold">Testni modal</h2>
        <p>To je vsebina znotraj modala jsah sdhodaoaoijoiajoia ioasa odj ad jaois jasiodsaoa.</p>
      </OurModal>

      <OurPopUp isOpen={showPopUp} onClose={() => setShowPopUp(false)}>
        <h2 className="text-xl font-semibold">Testni popup</h2>
        <p>To je vsebina znotraj modala jsah sdhodaoaoijoiajoia ioasa odj ad jaois jasiodsaoa.</p>
      </OurPopUp>
      
      <Nav/>
      
      <Maps mines={[{ ime: 'Rudnik Trbovlje', lat: 46.154, lon: 15.049 },{ ime: 'Rudnik Velenje', lat: 46.362, lon: 15.110 }]}></Maps>
      
      {/* <button onClick={() => {modalOpenClose()}}>Preiskusi modal</button> */}
    </div>
  );
}

export default App;
