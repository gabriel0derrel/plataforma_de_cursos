import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './classes/Usuario/AuthContext';
import trekLogo from '../img/trek2.png';
import './styles/global.css';

document.querySelector('link[rel="icon"]')?.setAttribute('href', trekLogo);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
