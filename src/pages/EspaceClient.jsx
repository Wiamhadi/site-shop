import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexte/UserContext';
import "../Styles/EspaceClient.css";

export default function EspaceClient() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    navigate('/connexion');
  };

  return (
    <div className="container">
      <h1 className="title">👤 Espace Client</h1>

      <div className="infoBox">
        <p className="label">Nom : {user?.nom ?? 'Utilisateur'}</p>
        <p className="label">Email : {user?.email ?? ''}</p>
      </div>

      <button className="button catalogue-btn" onClick={() => navigate('/catalogue')}>
        📦 Voir le catalogue
      </button>

      <button className="button" onClick={logout}>
        Se déconnecter
      </button>
    </div>
  );
}