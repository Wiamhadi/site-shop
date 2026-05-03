import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Polyfill pour React 19
global.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  cleanup();
  
});