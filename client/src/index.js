import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './components/App';

// --- 1. IMPORT CHAKRA TOOLS ---
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// --- 2. IMPORT BLOCKCHAIN CONTEXT ---
import { BlockchainProvider } from './context/Blockchain.context';

// --- 3. CONFIGURE THE THEME ---
// This forces dark mode, making all default text white.
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false, // We don't want it to check the OS theme
};

// --- 4. CREATE THE THEME ---
const theme = extendTheme({ 
  config,
  styles: {
    global: {
      // This override ensures our custom gradient from App.css
      // isn't overwritten by Chakra's default dark mode background.
      'body': {
        bg: 'none', 
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* --- 5. PROVIDE THE THEME TO CHAKRA --- */}
    <ChakraProvider theme={theme}>
      <BlockchainProvider>
        <App />
      </BlockchainProvider>
    </ChakraProvider>
  </React.StrictMode>
);