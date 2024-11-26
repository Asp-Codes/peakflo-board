import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ThemeProvider } from '@mui/material'
// const theme = createTheme({});
import {Theme} from './theme/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={Theme}>
    <App />
    </ThemeProvider>
  </StrictMode>,
)
