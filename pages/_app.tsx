import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Sidebar />
      <Box sx={{ marginLeft: { sm: '240px' } }}>
        <Component {...pageProps} />
      </Box>
    </UserProvider>
  )
}

export default MyApp
