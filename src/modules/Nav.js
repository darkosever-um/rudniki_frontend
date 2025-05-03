import React, { useState } from 'react';
import OurButton from '../components/OurButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

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

      
    </div>
  );
}

export default Nav;