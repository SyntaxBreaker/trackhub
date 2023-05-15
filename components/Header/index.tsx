import { AppBar, Box, Typography, Button, Toolbar, Link } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Header() {
    const { user } = useUser();

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
                        TrackHub
                    </Typography>
                    {user ? <Link href="/api/auth/logout" color="inherit">Logout</Link> : <Link href="/api/auth/login" color="inherit">Login</Link>}
                </Toolbar>
            </AppBar>
        </Box>
    )
}