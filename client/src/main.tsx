import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import Router from './routes/MainRoutes'
import { QueryClientProvider,QueryClient } from '@tanstack/react-query'

const client =  new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <Browser */}
    <QueryClientProvider client={client}>

    <Router/>
    </QueryClientProvider>
  </React.StrictMode>,
)
