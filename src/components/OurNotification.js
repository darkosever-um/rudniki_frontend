import React from 'react';

// Ikone za notifikacije
// Uporabljamo Material UI ikone
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';

function OurNotification({ type = 'notification', title, text, onClose }) {
  const Icon = type === 'alert' ? WarningAmberIcon : NotificationsActiveIcon;
  const colorClass = type === 'alert' ? 'bg-white border-red-400' : 'bg-white border-yellow-400';

  return (
    <div className={`w-80 shadow-lg border-l-4 rounded-md p-4 ${colorClass} z-50 mb-3 relative`}>
      {/* Tipka za zaprtje notifikacije */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg font-bold"
        aria-label="Zapri"
      >
        <CloseIcon/>
      </button>

      <div className="flex gap-3 pr-6">
        <Icon className="mt-1" />
        <div className='justify-items-start'>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm">{text}</p>
        </div>
      </div>
    </div>
  );
}

export default OurNotification;