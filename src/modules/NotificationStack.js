import React, { useState } from 'react';
import OurNotification from '../components/OurNotification';

let nextId = 1;

function NotificationStack() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notif) => {
    const newNotif = { ...notif, id: nextId++ };
    setNotifications((prev) => [...prev, newNotif]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 flex flex-col items-end z-50">
      {notifications.map((n) => (
        <OurNotification
          key={n.id}
          {...n}
          onClose={() => removeNotification(n.id)}
        />
      ))}

      {/* Testni button */}
      <button
        hidden
        onClick={() =>
          addNotification({
            type: 'notification',
            title: 'Manual close',
            text: 'Click ✖ to dismiss this.',
          })
        }
      >
        Add Notification
      </button>
    </div>
  );
}

export default NotificationStack;