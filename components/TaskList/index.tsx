import {
    Alert,
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Modal,
    Tooltip,
    Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { calculateRemainingDays } from "../../utils/date";
import ITask from "../../types/task";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import TaskModal from "../TaskModal";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export default function TaskList({
    tasks,
    setTasks,
}: {
    tasks?: ITask[];
    setTasks: React.Dispatch<React.SetStateAction<ITask[] | undefined>>;
}) {
    const [ID, setID] = useState<null | string>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedItem, setSelectedItem] = useState<ITask | null>(null);
    const [error, setError] = useState("");
    const [isDesriptionCollapsed, setIsDesriptionCollapsed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        setID(window.location.href.split("/")[4]);
    }, []);

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
                setTasks((tasks) => tasks?.filter((task) => task.id !== deletedTask.id));
            })
            .catch((err) => setError(err.message));
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                }}
            >
                <Typography variant="h5" component="h2">
                    Recent Tasks ({tasks?.length})
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        component={Link}
                        href={`/`}
                        startIcon={<ArrowBackIcon />}
                        variant="contained"
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
                            Important: Task &quot;{task.name}&quot; is overdue. You can change the deadline.
                        </Alert>
                    )
            )}
            {tasks && tasks.length > 0 ? (
                <Grid container spacing={4} direction="row">
                    {tasks.map((task) => (
                        <Grid item xs={12} sm={6} md={4} key={task.id}>
                            <Card
                                sx={{
                                    padding: 0.5,
                                    borderRadius: 2,
                                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                                    "&:hover": {
                                        cursor: "pointer",
                                        transform: "scale3d(1.006, 1.006, 1)",
                                    },
                                }}
                                onClick={() => {
                                    setIsOpen(true);
                                    setSelectedItem(task);
                                }}
                            >
                                <CardContent
                                    sx={{
                                        position: "relative",
                                        paddingBottom: "16px !important",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                                            {task.name}
                                        </Typography>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleClick(e, task);
                                            }}
                                            aria-label="Options"
                                        >
                                            <MoreVertIcon fontSize="medium" />
                                        </IconButton>
                                    </Box>
                                    {isDesriptionCollapsed && selectedItem?.id === task.id ? (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            component={Box}
                                            sx={{
                                                whiteSpace: "pre-wrap",
                                                marginTop: 1,
                                                fontSize: "12px",
                                            }}
                                        >
                                            <ReactMarkdown>{task.description}</ReactMarkdown>
                                        </Typography>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            component={Box}
                                            sx={{
                                                overflow: "hidden",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                marginTop: 1,
                                                whiteSpace: "pre-wrap",
                                                fontSize: "12px",
                                            }}
                                        >
                                            <ReactMarkdown>{task.description}</ReactMarkdown>
                                        </Typography>
                                    )}
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            marginTop: 2,
                                            position: "absolute",
                                            right: "16px",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isDesriptionCollapsed || selectedItem?.id !== task.id) {
                                                setIsDesriptionCollapsed(true);
                                                setSelectedItem(task);
                                            } else {
                                                setIsDesriptionCollapsed(false);
                                                setSelectedItem(null);
                                            }
                                        }}
                                    >
                                        {isDesriptionCollapsed && selectedItem?.id === task.id
                                            ? "Show less"
                                            : "Show more"}
                                    </Button>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginTop: 8,
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
                                        <AvatarGroup>
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
                                </CardContent>
                            </Card>
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
                                    onClick={() => {
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
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Alert severity="info" variant="outlined">
                    There are no tasks.
                </Alert>
            )}
        </Box>
    );
}
