import { useState } from "react"
import { Box, Typography, TextField, Button } from "@mui/material"
import validateField from "../../utils/validateField";
import axios from "axios";
import { UserProfile } from "@auth0/nextjs-auth0/client";

export default function ProjectForm({ user, method }: { user: UserProfile | undefined, method: string }) {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [error, setError] = useState(null);

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
                Create a new project
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
                Add a new project
            </Button>
        </Box>
    )
}