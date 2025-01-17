import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";

export default function ProjectListHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" component="h1" fontWeight={600}>
        Project list
      </Typography>
      <Button
        component={Link}
        href="/projects/create"
        startIcon={<AddIcon />}
        variant="contained"
        color="primary"
      >
        New project
      </Button>
    </Box>
  );
}
