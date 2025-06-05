import { createContext, useContext } from 'react';

export const notificationContext = createContext(null);

export const useNotification = () => useContext(notificationContext);