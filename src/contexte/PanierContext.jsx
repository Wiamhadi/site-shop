import { createContext, useState } from "react";

export const PanierContext = createContext();

export const PanierProvider = ({ children }) => {
  const [panier, setPanier] = useState([]);

  const ajouterAuPanier = (produit) => {
    setPanier((prev) => {
      // Vérifie si le produit existe déjà dans le panier
      const existant = prev.find((item) => item._id === produit._id);
      
      if (existant) {
        // Augmente la quantité
        return prev.map((item) =>
          item._id === produit._id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      } else {
        // Ajoute le produit avec quantité 1
        return [...prev, { ...produit, quantite: 1 }];
      }
    });
  };

  const retirerDuPanier = (id) => {
    setPanier((prev) => prev.filter((item) => item._id !== id));
  };

  const modifierQuantite = (id, quantite) => {
    if (quantite <= 0) {
      retirerDuPanier(id);
    } else {
      setPanier((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, quantite } : item
        )
      );
    }
  };

  const viderPanier = () => {
    setPanier([]);
  };

  const total = panier.reduce((acc, item) => acc + item.prix * item.quantite, 0);

  return (
    <PanierContext.Provider
      value={{
        panier,
        ajouterAuPanier,
        retirerDuPanier,
        modifierQuantite,
        viderPanier,
        total,
      }}
    >
      {children}
    </PanierContext.Provider>
  );
};