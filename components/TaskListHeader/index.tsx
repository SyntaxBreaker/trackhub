import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface TaskListHeaderProps {
  ID?: string;
}

export default function TaskListHeader({ ID }: TaskListHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
        gap: "8px",
        flexWrap: "wrap",
      }}
    >
      <Typography variant="h5" component="h1" fontWeight={600}>
        Recent Tasks
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          component={Link}
          href={`/`}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          color="primary"
        >
          Back to projects
        </Button>
        <Button
          component={Link}
          href={`/projects/${ID}/tasks/create`}
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
        >
          New task
        </Button>
      </Box>
    </Box>
  );
}
