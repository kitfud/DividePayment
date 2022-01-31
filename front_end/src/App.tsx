import React from 'react';
import logo from './logo.svg';
import './App.css';
import { DAppProvider, Config, ChainId } from '@usedapp/core';

const config: Config = {
  supportedChains: [ChainId.Rinkeby, ChainId.Kovan]
}
function App() {
  return (
    <DAppProvider config={config}>
      <div >
        Hello
      </div>
    </DAppProvider>

  );
}

export default App;
