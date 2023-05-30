import { useState } from "react"
import { Box, Typography, TextField, Button, Alert, List, ListItemText, IconButton, ListItem } from "@mui/material"
import validateField from "../../utils/validateField";
import axios from "axios";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import IProject from "../../types/project";
import { useRouter } from "next/router";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function ProjectForm({ user, method, project }: { user: UserProfile | undefined, method: string, project?: IProject }) {
    const [formData, setFormData] = useState({
        name: project?.name ?? '',
        description: project?.description ?? '',
        assignee: ''
    });
    const [assignees, setAssignees] = useState(project?.assignees ?? []);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleAssigneeAddition = () => {
        setAssignees(prev => ([
            ...prev, formData.assignee
        ]))

        setFormData(prev => ({
            ...prev,
            assignee: ''
        }))
    }

    const handleRemoveAssignee = (value: string) => {
        setAssignees(() => assignees.filter(assignee => assignee !== value))
    }

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!validateField(formData.name)) return

        const data = {
            name: formData.name,
            description: formData.description,
            creator: user?.email,
            assignees: assignees
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
            {method === "PATCH" &&
                <>
                    <Box sx={{ maxWidth: '350px', display: 'flex', flexDirection: 'row', gap: 1 }}>
                        <TextField
                            id="assignee"
                            name="assignee"
                            label="Assignee"
                            variant="outlined"
                            multiline={false}
                            sx={{ width: '300px' }}
                            value={formData.assignee}
                            onChange={handleChange}
                            onKeyDown={e => {
                                if(e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAssigneeAddition();
                                }
                            }}
                        />
                        <IconButton onClick={handleAssigneeAddition}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    {assignees.length > 0 &&
                        <>
                            <Typography
                                variant="h6"
                                component="p"
                            >
                                Assignee list:
                            </Typography>
                            <List>
                                {assignees.map(assignee => (
                                    <ListItem key={assignee} sx={{ display: 'flex', gap: 1 }}>
                                        <ListItemText>
                                            {assignee}
                                        </ListItemText>
                                        <IconButton onClick={() => handleRemoveAssignee(assignee)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    }
                </>
            }
            <Button
                type="submit"
                variant="contained"
                color="primary">
                {method === 'POST' ? 'Add a new project' : 'Edit the project'}
            </Button>
        </Box>
    )
}