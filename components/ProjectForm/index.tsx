import { useState } from "react"
import { Box, Typography, TextField, Button } from "@mui/material"
import validateField from "../../utils/validateField";
import axios from "axios";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import IProject from "../../types/project";
import { useRouter } from "next/router";

export default function ProjectForm({ user, method, project }: { user: UserProfile | undefined, method: string, project?: IProject }) {
    const [formData, setFormData] = useState({
        name: project?.name ?? '',
        description: project?.description ?? ''
    });
    const [error, setError] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!validateField(formData.name)) return

        const data = {
            ...formData,
            creator: user?.email,
            assignee: []
        }

        if (method === "POST") {
            axios.post('/api/projects/create', {
                ...data
            })
                .then(res => {
                    setError(null);
                    window.location.href = '/';
                })
                .catch(err => {
                    setError(err.message);
                })
        } else {
            axios.patch('/api/projects/edit', {
                project: data,
                id: id
            }).then(res => {
                setError(null);
                window.location.href = '/';
            })
                .catch(err => {
                    setError(err.message);
                })
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
                {method === 'POST' ? 'Create a new project' : 'Edit the project'}
            </Typography>
            {error && <Typography
                variant="body1"
                paragraph={true}
                sx={{ color: 'error.light' }}>
                {error}
            </Typography>}
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
            <Button
                type="submit"
                variant="contained"
                color="primary">
                {method === 'POST' ? 'Add a new project' : 'Edit the project'}
            </Button>
        </Box>
    )
}