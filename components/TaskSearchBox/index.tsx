import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import ITask from "../../types/task";

interface IProps {
  tasks: ITask[] | undefined;
  setFilteredTasks: React.Dispatch<React.SetStateAction<ITask[] | null>>;
}

function TaskSearchBox({ tasks, setFilteredTasks }: IProps) {
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    if (filterText) {
      setFilteredTasks(
        tasks!.filter(
          (task) =>
            task.name
              .toLocaleLowerCase()
              .includes(filterText.toLocaleLowerCase()) ||
            task.description
              .toLocaleLowerCase()
              .includes(filterText.toLocaleLowerCase())
        )
      );
    } else {
      setFilteredTasks(null);
    }
  }, [filterText]);

  return (
    <TextField
      value={filterText}
      placeholder="Search tasks..."
      onChange={(e) => setFilterText(e.currentTarget.value)}
      size="small"
      sx={{ width: "100%" }}
    />
  );
}

export default TaskSearchBox;
