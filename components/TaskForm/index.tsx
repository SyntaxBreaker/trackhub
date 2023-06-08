import { useState } from "react";
import { Box, TextField, Typography, Button, Alert, FormControlLabel, Checkbox } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { getCurrentDate } from "../../utils/date";
import { useRouter } from "next/router";
import axios from 'axios';
import validateField from "../../utils/validateField";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import ITask from "../../types/task";

export default function TaskForm({ user, method, task }: { user: UserProfile | undefined, method: string, task?: ITask }) {
    const [formData, setFormData] = useState({
        name: task?.name ?? '',
        description: task?.description ?? '',
        deadline: dayjs(task?.deadline) ?? getCurrentDate(),
        status: task?.status ?? 'IN_PROGRESS'
    });
    const [error, setError] = useState<null | string>(null);

    const router = useRouter();
    const { id } = router.query;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!validateField(formData.name)) return

        const data = {
            ...formData,
            authorId: user?.email,
            authorName: user?.nickname,
            authorAvatar: user?.picture
        }

        if (method === "POST") {
            axios.post('/api/tasks/create', {
                task: data,
                id
            })
                .then(res => {
                    setError(null)
                    window.location.href = `/projects/${id}/tasks`
                })
                .catch(err => setError(err.message))
        } else {
            axios.patch('/api/tasks/edit', {
                task: data,
                id: task?.id
            })
                .then(res => {
                    setError(null)
                    window.location.href = `/projects/${id}/tasks`
                })
                .catch(err => setError(err.message))
        }
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
            <Typography
                variant="h5"
                component="h2">
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
                sx={{ width: '350px' }}
                value={formData.name}
                onChange={handleChange}
            />
            <TextField
                id="description"
                name="description"
                label="Description"
                variant="outlined"
                multiline={true}
                sx={{ width: '350px' }}
                value={formData.description}
                onChange={handleChange}
            />
            {method === "PATCH" && <FormControlLabel
                control={<Checkbox
                    checked={formData.status === "COMPLETED" ? true : false}
                    onChange={event => setFormData(prevData => ({
                        ...prevData,
                        status: event.target.checked ? "COMPLETED" : "IN_PROGRESS"
                    }))}
                />}
                label="Completed"
            />}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    minDate={getCurrentDate()}
                    value={formData.deadline}
                    onChange={(newValue) => setFormData(prevData => ({
                        ...prevData,
                        deadline: dayjs(newValue)
                    }))} />
            </LocalizationProvider>
            <Button
                type="submit"
                variant="contained"
                color="primary">
                {method === "POST" ? "Add a new task" : "Edit the task"}
            </Button>
        </Box>
    )
}