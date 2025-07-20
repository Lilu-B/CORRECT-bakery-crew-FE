import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx';
import { BrowserRouter } from 'react-router-dom'; 
import './styles/main.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);