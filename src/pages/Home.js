import { useState } from 'react';
import Maps from '../modules/Maps';
import NotificationStack from '../modules/NotificationStack';

function Home() {

  return (
    <div className="App">
      <NotificationStack/>      
      <Maps mines={[{ ime: 'Rudnik Trbovlje', lat: 46.154, lon: 15.049 },{ ime: 'Rudnik Velenje', lat: 46.362, lon: 15.110 }]}></Maps>
    </div>
  );
}

export default Home;
