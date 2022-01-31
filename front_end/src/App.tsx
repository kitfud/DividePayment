import React from 'react';
import { DAppProvider, Config, ChainId } from '@usedapp/core';
import Header from './components/Header';
import { Container } from "@material-ui/core"


const config: Config = {
  supportedChains: [ChainId.Rinkeby, ChainId.Kovan]
}

function App() {
  return (
    <DAppProvider config={config}>
      <Header />
      <Container maxWidth="md">
        <div >
          Hello
        </div>
      </Container>

    </DAppProvider>

  );
}

export default App;
