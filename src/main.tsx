import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for PWA WebAPK installation on Poco, Realme and Android devices
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('YouTube Gold ServiceWorker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('YouTube Gold ServiceWorker registration notice:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
