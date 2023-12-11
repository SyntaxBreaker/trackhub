import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReactMarkdown from "react-markdown";
import styles from "../../styles/markdown.module.css";
import { calculateRemainingDays } from "../../utils/date";
import TaskModal from "../TaskModal";
import ITask from "../../types/task";
import { useState } from "react";
import axios from "axios";
import { useUser } from "@auth0/nextjs-auth0/client";

interface IProps {
  task: ITask;
  setTasks: React.Dispatch<React.SetStateAction<ITask[] | undefined>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItem: ITask | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<ITask | null>>;
}

export default function Task({
  task,
  setTasks,
  setError,
  isOpen,
  setIsOpen,
  selectedItem,
  setSelectedItem,
}: IProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { user } = useUser();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, item: ITask) => {
    setAnchorEl(e.currentTarget);
    setSelectedItem(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDeleteTask = () => {
    axios
      .delete(`/api/tasks/delete/${selectedItem?.id}`)
      .then((res) => {
        setError("");
        const { deletedTask } = res.data;
        setTasks((tasks) =>
          tasks?.filter((task) => task.id !== deletedTask.id)
        );
      })
      .catch((err) => setError(err.message));
  };

  return (
    <Card
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(true);
        setSelectedItem(task);
      }}
      sx={{
        padding: 1,
        borderRadius: 2,
        boxShadow: "rgba(0, 0, 0, 0.18) 0px 0px 0px 1px",
        "&:hover": {
          cursor: "pointer",
          transform: "scale3d(1.004, 1.004, 1)",
        },
        flexBasis: { xs: "100%", md: "calc(33% - 7px)" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {task.name}
        </Typography>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleClick(e, task);
          }}
          aria-label="Options"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
      {task.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          component={Box}
          sx={{
            marginTop: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            whiteSpace: "pre-wrap",
            fontSize: "12px",
          }}
        >
          <ReactMarkdown className={styles.reactMarkdown}>
            {task.description}
          </ReactMarkdown>
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: task.description ? 1 : 0,
        }}
      >
        <Typography sx={{ fontSize: 12 }} color="text.secondary">
          <AccessTimeIcon
            color="warning"
            sx={{
              fontSize: 12,
              verticalAlign: "text-top",
            }}
          />{" "}
          {task.status === "COMPLETED"
            ? "Completed"
            : calculateRemainingDays(task.deadline) >= 1
            ? `Due in ${calculateRemainingDays(task.deadline)} ${
                calculateRemainingDays(task.deadline) === 1 ? "day" : "days"
              }`
            : calculateRemainingDays(task.deadline) === 0
            ? "Due is Today"
            : "Overdue"}
        </Typography>
        <AvatarGroup sx={{ marginRight: 0.75 }}>
          <Tooltip title={task.authorName} arrow>
            <Avatar
              src={task.authorAvatar}
              alt={task.authorName}
              sx={{
                width: 24,
                height: 24,
              }}
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
      <Menu
        open={Boolean(anchorEl) && selectedItem?.id === task.id}
        onClose={handleClose}
        anchorEl={anchorEl}
      >
        <MenuItem
          onClick={() => {
            setIsOpen(true);
            setSelectedItem(task);
          }}
        >
          Edit task
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
            handleDeleteTask();
          }}
        >
          Remove task
        </MenuItem>
      </Menu>
      <TaskModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        task={task}
        user={user}
        setTasks={setTasks}
      />
    </Card>
  );
}
