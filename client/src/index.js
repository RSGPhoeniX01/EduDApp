import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './components/App';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import { BlockchainProvider } from './context/Blockchain.context';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false, 
};

const theme = extendTheme({ 
  config,
  styles: {
    global: {
      'body': {
        bg: 'none', 
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BlockchainProvider>
        <App />
      </BlockchainProvider>
    </ChakraProvider>
  </React.StrictMode>
);