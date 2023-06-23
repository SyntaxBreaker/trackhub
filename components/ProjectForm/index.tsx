import { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Paper,
    IconButton,
    TableContainer,
    Table,
    TableCell,
    TableHead,
    TableRow,
    TableBody,
} from "@mui/material";
import validateField from "../../utils/validateField";
import axios from "axios";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import IProject from "../../types/project";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function ProjectForm({
    user,
    method,
    project,
    setIsOpen,
    setProjects,
}: {
    user: UserProfile | undefined;
    method: string;
    project?: IProject;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setProjects?: React.Dispatch<React.SetStateAction<IProject[]>>;
}) {
    const [formData, setFormData] = useState({
        name: project?.name ?? "",
        description: project?.description ?? "",
        assignee: "",
    });
    const [assignees, setAssignees] = useState(project?.assignees ?? []);
    const [error, setError] = useState(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAssigneeAddition = () => {
        setAssignees((prev) => [...prev, formData.assignee]);

        setFormData((prev) => ({
            ...prev,
            assignee: "",
        }));
    };

    const handleRemoveAssignee = (value: string) => {
        setAssignees(() => assignees.filter((assignee) => assignee !== value));
    };

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!validateField(formData.name)) return;

        const data = {
            name: formData.name,
            description: formData.description,
            creator: user?.email,
            assignees: assignees,
        };

        if (method === "POST") {
            axios
                .post("/api/projects/create", {
                    ...data,
                })
                .then((res) => {
                    setError(null);
                    window.location.href = "/";
                })
                .catch((err) => {
                    setError(err.message);
                });
        } else {
            axios
                .patch("/api/projects/edit", {
                    project: data,
                    id: project?.id,
                })
                .then((res) => {
                    setError(null);
                    const { updatedProject } = res.data;
                    setProjects &&
                        setProjects((projects) =>
                            projects?.map((project) => (project.id === updatedProject.id ? updatedProject : project))
                        );
                    setIsOpen && setIsOpen(false);
                })
                .catch((err) => {
                    setError(err.message);
                });
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
            }}
        >
            <Typography variant="h5" component="h2">
                {method === "POST" ? "Create a new project" : "Edit the project"}
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
            <TextField
                id="description"
                name="description"
                label="Description"
                variant="outlined"
                multiline={true}
                fullWidth={method !== "POST"}
                sx={[
                    method === "POST" && {
                        width: "350px",
                    },
                ]}
                value={formData.description}
                onChange={handleChange}
            />
            {method === "PATCH" && (
                <>
                    <Typography variant="h6" component="p" sx={{ marginTop: 2 }}>
                        Assignee list:
                    </Typography>
                    <TableContainer component={Paper} elevation={16}>
                        <Table aria-label="assignee list">
                            <TableHead sx={{ backgroundColor: "primary.main" }}>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            color: "primary.contrastText",
                                        }}
                                    >
                                        Email:
                                    </TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assignees.map((assignee) => (
                                    <TableRow key={assignee}>
                                        <TableCell>{assignee}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleRemoveAssignee(assignee)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            id="assignee"
                                            name="assignee"
                                            label="Assignee"
                                            variant="standard"
                                            multiline={false}
                                            value={formData.assignee}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAssigneeAddition();
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={handleAssigneeAddition}>
                                            <AddIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 4 }}>
                {method === "POST" ? "Add a new project" : "Edit the project"}
            </Button>
        </Box>
    );
}
