import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Sidebar from '../components/Sidebar';
import { Box, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const changeTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  }

  return (
    <UserProvider>
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <Sidebar />
        <Box sx={{ p: 1, maxWidth: '1280px', marginX: 'auto' }}>
          <Component {...pageProps} />
        </Box>
      </ThemeProvider>
      <IconButton size="large" color="inherit" onClick={changeTheme} sx={{ position: 'absolute', bottom: '20px', right: '20px' }}>
        {isDarkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </UserProvider >
  )
}

export default MyApp
