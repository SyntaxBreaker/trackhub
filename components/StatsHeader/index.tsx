import { useUser } from "@auth0/nextjs-auth0/client";
import { Box, Typography } from "@mui/material";

export default function StatsHeader() {
  const { user } = useUser();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          variant="body2"
          component="p"
          sx={{ color: "text.secondary" }}
        >
          Welcome back, {user?.nickname}!
        </Typography>
        <Typography variant="h5" component="h1" fontWeight="600">
          Your Progress Report
        </Typography>
      </Box>
    </Box>
  );
}
