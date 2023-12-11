import { Alert, Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { calculateRemainingDays } from "../../utils/date";
import ITask from "../../types/task";
import { useEffect, useState } from "react";
import Task from "../Task";

export default function TaskList({
  tasks,
  setTasks,
}: {
  tasks?: ITask[];
  setTasks: React.Dispatch<React.SetStateAction<ITask[] | undefined>>;
}) {
  const [ID, setID] = useState<null | string>(null);
  const [selectedItem, setSelectedItem] = useState<ITask | null>(null);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setID(window.location.href.split("/")[4]);
  }, []);

  return (
    <Box sx={{ p: 2 }}>
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
        <Typography variant="h5" component="h1">
          Recent Tasks ({tasks?.length})
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
      {error && (
        <Alert severity="error" sx={{ marginY: 2 }}>
          {error}
        </Alert>
      )}
      {tasks?.map(
        (task) =>
          task.status === "IN_PROGRESS" &&
          calculateRemainingDays(task.deadline) < 0 && (
            <Alert
              severity="warning"
              variant="outlined"
              sx={{ marginY: 2 }}
              key={task.id}
              action={
                <Button
                  color="warning"
                  onClick={() => {
                    setIsOpen(true);
                    setSelectedItem(task);
                  }}
                >
                  Edit
                </Button>
              }
            >
              Important: Task &quot;{task.name}&quot; is overdue. You can change
              the deadline.
            </Alert>
          )
      )}
      {tasks && tasks.length > 0 ? (
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              setTasks={setTasks}
              setError={setError}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          ))}
        </Box>
      ) : (
        <Alert severity="info" variant="outlined">
          There are no tasks.
        </Alert>
      )}
    </Box>
  );
}
