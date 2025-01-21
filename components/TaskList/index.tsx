import { Alert, Box, Button, Typography } from "@mui/material";
import { calculateRemainingDays } from "../../utils/date";
import ITask from "../../types/task";
import { useState } from "react";
import Task from "../Task";
import TaskSearchBox from "../TaskSearchBox";

export default function TaskList({
  tasks,
  setTasks,
}: {
  tasks?: ITask[];
  setTasks: React.Dispatch<React.SetStateAction<ITask[] | undefined>>;
}) {
  const [selectedItem, setSelectedItem] = useState<ITask | null>(null);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<ITask[] | null>(null);

  return (
    <Box>
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
              <Typography display="inline" fontWeight={600} variant="body2">
                Important:
              </Typography>{" "}
              <Typography display="inline" variant="body2">
                Task &quot;{task.name}&quot; is overdue. You can change the
                deadline.
              </Typography>
            </Alert>
          )
      )}
      {tasks && tasks.length > 0 ? (
        <>
          <TaskSearchBox tasks={tasks} setFilteredTasks={setFilteredTasks} />
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {(filteredTasks ?? tasks)?.map((task) => (
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
        </>
      ) : (
        <Alert severity="info" variant="outlined">
          There are no tasks.
        </Alert>
      )}
    </Box>
  );
}
