import React, { useState } from 'react';
import OurButton from '../components/OurButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import OurSearch from '../components/OurSearch';

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <div className="relative">
      {/* Top meni – skrajšan če je menuOpen */}
      <div
        className={`h-12 flex items-center justify-between px-4 bg-gray-100 border-b fixed top-0 z-20 ${
          menuOpen ? 'left-64 w-[calc(100%-16rem)]' : 'left-0 w-full'
        }`}
      >
        <button onClick={toggleMenu} className="text-2xl" aria-label="Odpri meni">
          <MenuOpenIcon/>
        </button>
        <div className="flex items-center gap-4">
          <button className="text-2xl" aria-label="Nastavitve"><SettingsIcon/></button>
          <button className="text-2xl" aria-label="Profil"><AccountCircleIcon/></button>
        </div>
      </div>
      
      {/* Stranski meni */}
      {menuOpen && (
        <>
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-md z-20 flex flex-col justify-between p-4">
            <div>
              <div>
                <OurSearch></OurSearch>
              </div>
              
              <span className="text-xs opacity-30 font-bold mb-4">ORODJA</span>
              <ul className="space-y-2">
                <li><a href="/zemljevid" className="block hover:underline">Zemljevid</a></li>
                <li><a href="/rudniki" className="block hover:underline">Rudniki</a></li>
                <li><a href="/statistika" className="block hover:underline">Statistika rudnikov</a></li>
              </ul>

              <br/>

              <span className="text-xs opacity-30 font-bold mb-4">NASTAVITVE</span>
              <ul className="space-y-2">
                <li><a href="/profil" className="block hover:underline">Profil</a></li>
                <li><a href="/nastavitve-videza" className="block hover:underline">Izgled aplikacije</a></li>
              </ul>

              <br/>

              <span className="text-xs opacity-30 font-bold mb-4">POMOČ</span>
              <ul className="space-y-2">
                <li><a href="/faq" className="block hover:underline">FAQ</a></li>
                <li><a href="/kontakt" className="block hover:underline">Kontakt</a></li>
              </ul>
            </div>

            <div>
              <OurButton
                onClickDo={() => alert('Odjava')} // TODO @darkosever : dodaj funkcionalnost
                // className="w-full mt-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                text={"Odjava"}
                variant='red'
                classNameProps='w-full mt-4'
              >
                Odjava
              </OurButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Nav;