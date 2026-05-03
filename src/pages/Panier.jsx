import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanierContext } from "../contexte/paniercontext";
import '../Styles/Panier.css';

const Panier = () => {
  const navigate = useNavigate();
  const { panier, retirerDuPanier, modifierQuantite, viderPanier, total } = useContext(PanierContext);

  if (panier.length === 0) {
    return (
      <div className="panier-container">
        <h1>🛒 Mon Panier</h1>
        <div className="panier-vide">
          <p>Votre panier est vide</p>
          <button className="btn-catalogue" onClick={() => navigate('/catalogue')}>
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panier-container">
      <h1>🛒 Mon Panier</h1>

      <div className="panier-content">
        <div className="panier-items">
          {panier.map((item) => (
            <div key={item._id} className="panier-item">
              <img src={item.image} alt={item.nom} className="item-image" />
              <div className="item-info">
                <h3>{item.nom}</h3>
                <p className="item-categorie">{item.categorie}</p>
                <p className="item-prix">{item.prix} €</p>
              </div>
              <div className="item-actions">
                <div className="quantite-controls">
                  <button onClick={() => modifierQuantite(item._id, item.quantite - 1)}>
                    -
                  </button>
                  <span>{item.quantite}</span>
                  <button onClick={() => modifierQuantite(item._id, item.quantite + 1)}>
                    +
                  </button>
                </div>
                <button className="btn-supprimer" onClick={() => retirerDuPanier(item._id)}>
                  🗑️ Supprimer
                </button>
              </div>
              <div className="item-total">
                {(item.prix * item.quantite).toFixed(2)} €
              </div>
            </div>
          ))}
        </div>

        <div className="panier-resume">
          <h2>Résumé de la commande</h2>
          <div className="resume-ligne">
            <span>Sous-total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <div className="resume-ligne">
            <span>Livraison</span>
            <span>Gratuite</span>
          </div>
          <div className="resume-total">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <button className="btn-commander">
            Commander
          </button>
          <button className="btn-vider" onClick={viderPanier}>
            Vider le panier
          </button>
          <button className="btn-continuer" onClick={() => navigate('/catalogue')}>
            Continuer mes achats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Panier;