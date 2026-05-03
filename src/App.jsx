import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexte/UserContext';
import { PanierProvider } from './contexte/paniercontext';  

import Inscription from './pages/Inscription';
import Connexion from './pages/Connexion';
import EspaceClient from './pages/espaceclient';
import Catalogue from './pages/Catalogue';
import Panier from './pages/panier';

function App() {
  return (
    <UserProvider>
      <PanierProvider> 
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/connexion" />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/espace-client" element={<EspaceClient />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/panier" element={<Panier />} /> 
          </Routes>
        </BrowserRouter>
      </PanierProvider> 
    </UserProvider>
  );
}

export default App;