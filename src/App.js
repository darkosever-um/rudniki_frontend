import './App.css';
import Maps from './modules/Maps'; 
import Nav from './modules/Nav';
// import OurButton from './components/OurButton';

function App() {
  return (
    <div className="App">
      {/* <OurButton text={"test"} onClickDo={() => alert('Button clicked!')} variant='blue'/> */}
      <Nav></Nav>
      <Maps mines={[{ ime: 'Rudnik Trbovlje', lat: 46.154, lon: 15.049 },{ ime: 'Rudnik Velenje', lat: 46.362, lon: 15.110 }]}></Maps>
    </div>
  );
}

export default App;
