import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanierContext } from '../contexte/paniercontext';
import '../Styles/Catalogue.css';

const Catalogue = () => {
  const navigate = useNavigate();
  const { ajouterAuPanier } = useContext(PanierContext);

  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/produits');

        if (!response.ok) {
          throw new Error('Erreur chargement produits');
        }

        const data = await response.json();
        setProduits(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, []);

  const handleAjouterAuPanier = (produit) => {
    ajouterAuPanier(produit);
    navigate('/panier');
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="catalogue-container">
      <h1>Catalogue</h1>

      <div className="produits-grid">
        {produits.map((produit) => (
          <div key={produit._id} className="produit-card">

<img
  src={produit.image || "https://via.placeholder.com/300x200"}
  alt={produit.nom}
/>

            <h3>{produit.nom}</h3>
            <p>{produit.prix} €</p>

            <button onClick={() => handleAjouterAuPanier(produit)}>
              Ajouter au panier
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogue;