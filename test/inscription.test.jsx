import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Inscription from "../src/pages/Inscription";

// Mock fetch
global.fetch = vi.fn();

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Page d\'Inscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========== TEST 1 : Formulaire vide ==========
  it('affiche le formulaire avec tous les champs vides au chargement', () => {
    renderWithRouter(<Inscription />);
    
    expect(screen.getByRole('textbox', { name: /Nom/i })).toHaveValue('');
    expect(screen.getByRole('textbox', { name: /Email/i })).toHaveValue('');
    expect(screen.getByLabelText('Mot de passe')).toHaveValue('');
    expect(screen.getByLabelText('Confirmer le mot de passe')).toHaveValue('');
    expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument();
  });

  // ========== TEST 2 : Soumission avec champs vides ==========
  it('affiche des messages d\'erreur quand les champs sont vides', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Inscription />);
    
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));
    
    expect(screen.getByText(/le nom est requis/i)).toBeInTheDocument();
    expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
    expect(screen.getByText(/au moins 12 caractères/i)).toBeInTheDocument();
    expect(screen.getByText(/veuillez confirmer votre mot de passe/i)).toBeInTheDocument();
  });

  // ========== TEST 3 : Email invalide ==========
  it('refuse un email invalide', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Inscription />);
    
    await user.type(screen.getByLabelText(/nom/i), 'Jean');
    await user.type(screen.getByLabelText(/^email$/i), 'emailinvalide');
    await user.type(screen.getByLabelText('Mot de passe'), 'Password123!');
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'Password123!');
    
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));
    
    expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
  });

  // ========== TEST 4 : Mot de passe trop court ==========
  it('refuse un mot de passe trop court (< 12 caractères)', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Inscription />);
    
    await user.type(screen.getByLabelText(/nom/i), 'Jean');
    await user.type(screen.getByLabelText(/^email$/i), 'jean@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'Pass1!');
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'Pass1!');
    
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));
    
    expect(screen.getByText(/au moins 12 caractères/i)).toBeInTheDocument();
  });

  // ========== TEST 5 : Mot de passe sans majuscule ==========
  it('refuse un mot de passe sans majuscule', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Inscription />);
    
    await user.type(screen.getByLabelText(/nom/i), 'Jean');
    await user.type(screen.getByLabelText(/^email$/i), 'jean@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123!');
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'password123!');
    
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));
    
    expect(screen.getByText(/au moins une majuscule/i)).toBeInTheDocument();
  });

  // ========== TEST 6 : Mot de passe sans minuscule ==========
  it('refuse un mot de passe sans minuscule', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Inscription />);
    
    await user.type(screen.getByLabelText(/nom/i), 'Jean');
    await user.type(screen.getByLabelText(/^email$/i), 'jean@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'PASSWORD123!');
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'PASSWORD123!');
    
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));
    
    expect(screen.getByText(/au moins une minuscule/i)).toBeInTheDocument();
  });

  // ========== TEST 7 : Mot de passe sans chiffre ==========
  it('refuse un mot de passe sans chiffre', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Inscription />);
    
    await user.type(screen.getByLabelText(/nom/i), 'Jean');
    await user.type(screen.getByLabelText(/^email$/i), 'jean@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'PasswordLong!');
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'PasswordLong!');
    
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));
    
    expect(screen.getByText(/au moins un chiffre/i)).toBeInTheDocument();
  });

  // ========== TEST 8 : Mot de passe sans caractère spécial ==========
  it('refuse un mot de passe sans caractère spécial', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Inscription />);
    
    await user.type(screen.getByLabelText(/nom/i), 'Jean');
    await user.type(screen.getByLabelText(/^email$/i), 'jean@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'PasswordLong123');
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'PasswordLong123');
    
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));
    
    expect(screen.getByText(/au moins un caractère spécial/i)).toBeInTheDocument();
  });

  // ========== TEST 9 : Mots de passe non identiques ==========
  it('refuse si les mots de passe ne correspondent pas', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Inscription />);
    
    await user.type(screen.getByLabelText(/nom/i), 'Jean');
    await user.type(screen.getByLabelText(/^email$/i), 'jean@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'Password123!');
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'Password456!');
    
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));
    
    expect(screen.getByText(/les mots de passe ne correspondent pas/i)).toBeInTheDocument();
  });

  // ========== TEST 10 : Inscription réussie ==========
  it('accepte une inscription valide et redirige vers connexion', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Inscription réussie' })
    });
    
    renderWithRouter(<Inscription />);
    
    await user.type(screen.getByLabelText(/nom/i), 'Jean');
    await user.type(screen.getByLabelText(/^email$/i), 'jean@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'Password123!');
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'Password123!');
    
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    });
    
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/inscription',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          nom: 'Jean',
          email: 'jean@test.com',
          motDePasse: 'Password123!'
        })
      })
    );
    
    alertSpy.mockRestore();
  });

  // ========== TEST 11 : Erreur serveur (email déjà utilisé) ==========
  it('affiche une erreur si l\'email est déjà utilisé', async () => {
    const user = userEvent.setup();
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Email déjà utilisé' })
    });
    
    renderWithRouter(<Inscription />);
    
    await user.type(screen.getByLabelText(/nom/i), 'Jean');
    await user.type(screen.getByLabelText(/^email$/i), 'jean@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'Password123!');
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'Password123!');
    
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email déjà utilisé/i)).toBeInTheDocument();
    });
  });
});