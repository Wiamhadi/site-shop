import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Connexion from '../src/pages/Connexion';
import { UserContext } from '../src/contexte/UserContext';

// Mock fetch
global.fetch = vi.fn();

const mockSetUser = vi.fn();

const renderWithProviders = (component) => {
  return render(
    <UserContext.Provider value={{ user: null, setUser: mockSetUser }}>
      <BrowserRouter>{component}</BrowserRouter>
    </UserContext.Provider>
  );
};

describe('Page de Connexion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========== TEST 1 : Formulaire vide ==========
  it('affiche le formulaire avec tous les champs vides au chargement', () => {
    renderWithProviders(<Connexion />);
    
    expect(screen.getByRole('textbox', { name: /Email/i })).toHaveValue('');
    expect(screen.getByLabelText(/mot de passe/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
  });

  // ========== TEST 2 : Champs vides ==========
  it('affiche des messages d\'erreur quand les champs sont vides', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Connexion />);
    
    await user.click(screen.getByRole('button', { name: /se connecter/i }));
    
    expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument();
    expect(screen.getByText(/le mot de passe est requis/i)).toBeInTheDocument();
    
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveClass('error');
    expect(screen.getByLabelText(/mot de passe/i)).toHaveClass('error');
  });

  // ========== TEST 3 : Email invalide ==========
  it('refuse un email invalide', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Connexion />);
    
    await user.type(screen.getByLabelText(/^email$/i), 'emailinvalide');
    await user.type(screen.getByLabelText(/mot de passe/i), 'Password123!');
    
    await user.click(screen.getByRole('button', { name: /se connecter/i }));
    
    expect(screen.getByText(/email invalide/i)).toBeInTheDocument();
  });

  // ========== TEST 4 : Connexion réussie ==========
  it('authentifie un utilisateur avec des identifiants valides', async () => {
    const user = userEvent.setup();
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Connexion réussie',
        user: { nom: 'Jean', email: 'jean@test.com' }
      })
    });
    
    renderWithProviders(<Connexion />);
    
    await user.type(screen.getByLabelText(/^email$/i), 'jean@test.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'Password123!');
    
    await user.click(screen.getByRole('button', { name: /se connecter/i }));
    
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        nom: 'Jean',
        email: 'jean@test.com'
      });
    });
    
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5000/api/connexion',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'jean@test.com',
          motDePasse: 'Password123!'
        })
      })
    );
  });

  // ========== TEST 5 : Identifiants incorrects ==========
  it('affiche une erreur si les identifiants sont incorrects', async () => {
    const user = userEvent.setup();
    
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Email ou mot de passe incorrect' })
    });
    
    renderWithProviders(<Connexion />);
    
    await user.type(screen.getByLabelText(/^email$/i), 'jean@test.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'MauvaisPassword');
    
    await user.click(screen.getByRole('button', { name: /se connecter/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email ou mot de passe incorrect/i)).toBeInTheDocument();
    });
  });


});