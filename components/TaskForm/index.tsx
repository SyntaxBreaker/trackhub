import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
    Alert,
    FormControlLabel,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tabs,
    Tab,
    Paper,
} from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { getCurrentDate } from "../../utils/date";
import { useRouter } from "next/router";
import axios from "axios";
import validateField from "../../utils/validateField";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import ITask from "../../types/task";
import IProject from "../../types/project";
import Timer from "../Timer";
import ReactMarkdown from "react-markdown";

export default function TaskForm({
    user,
    method,
    task,
    project,
    setTasks,
    setIsOpen,
}: {
    user: UserProfile | undefined;
    method: string;
    task?: ITask;
    project?: IProject;
    setTasks?: React.Dispatch<React.SetStateAction<ITask[] | undefined>>;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [formData, setFormData] = useState({
        name: task?.name ?? "",
        description: task?.description ?? "",
        deadline: dayjs(task?.deadline) ?? getCurrentDate(),
        status: task?.status ?? "IN_PROGRESS",
        priority: task?.priority ?? "LOW",
        assignedUser: task?.assignedUser ?? "",
    });
    const [error, setError] = useState<null | string>(null);
    const [duration, setDuration] = useState(task?.duration || 0);
    const [currentTabValue, setCurrentTabValue] = useState("Edit");

    const router = useRouter();
    const { id } = router.query;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!validateField(formData.name)) return;

        const data = {
            ...formData,
            authorId: user?.email,
            authorName: user?.nickname,
            authorAvatar: user?.picture,
            duration: duration,
        };

        if (method === "POST") {
            axios
                .post("/api/tasks/create", {
                    task: data,
                    id,
                })
                .then((res) => {
                    setError(null);
                    window.location.href = `/projects/${id}/tasks`;
                })
                .catch((err) => setError(err.message));
        } else {
            axios
                .patch("/api/tasks/edit", {
                    task: data,
                    id: task?.id,
                })
                .then((res) => {
                    setError(null);
                    const { updatedTask } = res.data;
                    setTasks &&
                        setTasks((tasks) => tasks?.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
                    setIsOpen && setIsOpen(false);
                })
                .catch((err) => setError(err.message));
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: "16px",
                margin: "0 auto",
            }}
        >
            <Typography variant="h5" component="h2">
                {method === "POST" ? "Create a new task" : "Edit the task"}
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
                error={!validateField(formData.name) ? true : false}
                helperText={!validateField(formData.name) && "This name should have at least one character."}
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                fullWidth={method !== "POST"}
                sx={[
                    method === "POST" && {
                        width: "350px",
                    },
                ]}
                value={formData.name}
                onChange={handleChange}
            />
            <Box
                sx={{
                    width: method === "POST" ? "350px" : "100%",
                    padding: 1,
                    borderRadius: 2,
                    boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                }}
            >
                <Tabs value={currentTabValue} onChange={(e, newValue) => setCurrentTabValue(newValue)}>
                    <Tab label="Edit" value="Edit" />
                    <Tab label="Preview" value="Preview" />
                </Tabs>
                <Box sx={{ marginTop: 2 }}>
                    {currentTabValue === "Edit" ? (
                        <TextField
                            id="description"
                            name="description"
                            label="Description"
                            variant="outlined"
                            multiline={true}
                            fullWidth
                            value={formData.description}
                            onChange={handleChange}
                        />
                    ) : (
                        <ReactMarkdown>{formData.description}</ReactMarkdown>
                    )}
                </Box>
            </Box>
            <FormControl
                fullWidth={method !== "POST"}
                sx={[
                    method === "POST" && {
                        width: "350px",
                    },
                ]}
            >
                <InputLabel>Priority:</InputLabel>
                <Select
                    value={formData.priority}
                    label="priority"
                    name="priority"
                    onChange={(event) =>
                        setFormData((prevData) => ({
                            ...prevData,
                            [event.target.name]: event.target.value,
                        }))
                    }
                >
                    <MenuItem value="LOW">LOW</MenuItem>
                    <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                    <MenuItem value="HIGH">HIGH</MenuItem>
                </Select>
            </FormControl>
            {method === "PATCH" && (
                <>
                    <FormControl sx={{ width: "100%" }}>
                        <InputLabel>Assigned user:</InputLabel>
                        <Select
                            value={formData.assignedUser}
                            label="assignedUser"
                            name="assignedUser"
                            onChange={(event) =>
                                setFormData((prevData) => ({
                                    ...prevData,
                                    [event.target.name]: event.target.value,
                                }))
                            }
                        >
                            <MenuItem value=" ">&nbsp;</MenuItem>
                            <MenuItem value={task?.authorId}>{task?.authorId}</MenuItem>
                            {project?.assignees.map((assignee) => (
                                <MenuItem key={assignee} value={assignee}>
                                    {assignee}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.status === "COMPLETED" ? true : false}
                                onChange={(event) =>
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        status: event.target.checked ? "COMPLETED" : "IN_PROGRESS",
                                    }))
                                }
                            />
                        }
                        label="Completed"
                    />
                    {task && user?.email === task.assignedUser && (
                        <Timer id={task.id} duration={duration} setDuration={setDuration} handleSubmit={handleSubmit} />
                    )}
                </>
            )}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    minDate={getCurrentDate()}
                    value={formData.deadline}
                    onChange={(newValue) =>
                        setFormData((prevData) => ({
                            ...prevData,
                            deadline: dayjs(newValue),
                        }))
                    }
                />
            </LocalizationProvider>
            <Button type="submit" variant="contained" color="primary">
                {method === "POST" ? "Add a new task" : "Edit the task"}
            </Button>
        </Box>
    );
}
