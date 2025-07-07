import React, { useState } from 'react';
import OurNotification from '../components/OurNotification';
import { notificationContext } from '../notificationContext';

let nextId = 1;

function NotificationStack({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notif) => {
    const newNotif = { ...notif, id: nextId++ };
    setNotifications((prev) => [...prev, newNotif]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  };

  return (
    <notificationContext.Provider value={{ addNotification }}>
      {children}

      <div className="fixed top-4 right-4 flex flex-col items-end z-50">
        {notifications.map((n) => (
          <OurNotification
            key={n.id}
            {...n}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
    </notificationContext.Provider>
  );
}

export default NotificationStack;