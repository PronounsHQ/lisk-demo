import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrivyProvider } from "@privy-io/react-auth"
import { network } from './lib/constants.ts'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_APP_ID}
      clientId={import.meta.env.VITE_CLIENT_ID}
      config={{
        loginMethods: ["email"],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "all-users"
          }
        },
        defaultChain: network,
        supportedChains: [network]
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>,
)
