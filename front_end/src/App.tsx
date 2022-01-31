import React from 'react';
import { DAppProvider, Config, ChainId } from '@usedapp/core';
import Header from './components/Header';

const config: Config = {
  supportedChains: [ChainId.Rinkeby, ChainId.Kovan]
}

function App() {
  return (
    <DAppProvider config={config}>
      <Header />
      <div >
        Hello
      </div>
    </DAppProvider>

  );
}

export default App;
