import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Sidebar from "../components/Sidebar";
import { Box, IconButton } from "@mui/material";
import {
  createTheme,
  ThemeProvider,
  useColorScheme,
} from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

function App(props: AppProps) {
  return (
    <CssVarsProvider>
      <MyApp {...props} />
    </CssVarsProvider>
  );
}

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
  const { mode, setMode } = useColorScheme();

  const changeTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <UserProvider>
      <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
        <Sidebar />
        <Box sx={{ p: 1, maxWidth: "1280px", marginX: "auto" }}>
          <Component {...pageProps} />
        </Box>
      </ThemeProvider>
      <IconButton
        size="large"
        color="inherit"
        onClick={changeTheme}
        sx={{ position: "fixed", bottom: "20px", right: "20px" }}
        aria-label="Toggle Dark Mode"
      >
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </UserProvider>
  );
}

export default App;
