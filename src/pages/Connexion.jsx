
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../contexte/UserContext";
import "../Styles/Connexion.css";
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

const Connexion = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isLocked && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (remainingSeconds === 0 && isLocked) {
      setIsLocked(false);
      setFailedAttempts(0);
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isLocked, remainingSeconds]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const response = await fetch("http://localhost:5000/api/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          motDePasse: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      // Sauvegarde l'utilisateur dans le contexte
      setUser(data.user);
      setFailedAttempts(0);
      navigate("/espace-client");
    } catch (err) {
      setServerError(err.message);

      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setRemainingSeconds(LOCKOUT_SECONDS);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2>E-Shop
          </h2>
          <p>Connectez-vous à votre compte</p>

        {serverError && !isLocked && (
          <div className="server-error" role="alert">
            {serverError}
          </div>
        )}

        {isLocked && (
          <div className="server-error" role="alert" data-testid="lockout-message">
            Trop de tentatives. Réessayez dans {remainingSeconds} seconde
            {remainingSeconds > 1 ? "s" : ""}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="aylan@example.com"
            className={errors.email ? "error" : ""}
            disabled={isLoading || isLocked}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className="error-message">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={errors.password ? "error" : ""}
            disabled={isLoading || isLocked}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <span id="password-error" className="error-message">
              {errors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || isLocked}
          className="submit-btn"
          aria-label={isLoading ? "Connexion en cours" : "Se connecter"}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>

        <div className="login-link" style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <p style={{ color: "#666", marginBottom: "0.5rem" }}>
            Pas encore de compte ?
          </p>
          <button
            type="button"
            onClick={() => navigate("/inscription")}
            style={{
              background: "none",
              border: "none",
              fontWeight: "600",
              color: "#0066cc",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  );
};

export default Connexion;