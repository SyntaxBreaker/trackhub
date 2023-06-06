import { Alert, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Fragment, useEffect, useState } from "react";
import IProject from "../../types/project";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from "next/router";
import axios from "axios";

export default function ProjectList({ projects }: { projects: IProject[] }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedItem, setSelectedItem] = useState<IProject | null>(null);
    const [error, setError] = useState('');

    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) router.push('/api/auth/login');
    }, [user, isLoading]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, item: IProject) => {
        setAnchorEl(e.currentTarget);
        setSelectedItem(item);
    }

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedItem(null);
    }

    const handleDeleteProject = () => {
        axios.delete(`/api/projects/delete/${selectedItem?.id}`, {

        })
            .then(res => {
                setError('');
                router.push('/');
            })
            .catch(err => setError(err.message))
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" component="h2">
                    Project list:
                </Typography>
                <Button component={Link} href="/projects/create" startIcon={<AddIcon />} variant="contained" color="primary">New project</Button>
            </Box>
            {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table aria-label="simple table">
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white' }}>Description</TableCell>
                            <TableCell sx={{ color: 'white' }}>Creator</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map(project => (
                            <Fragment key={project.id}>
                                <TableRow sx={{ ":hover": { backgroundColor: '#e9ecef' } }}>
                                    <TableCell>{project.name}</TableCell>
                                    <TableCell sx={{ whiteSpace: 'pre-wrap' }}>{project.description}</TableCell>
                                    <TableCell>{project.creator}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={(e) => handleClick(e, project)} aria-label="Options">
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                <Menu
                                    open={Boolean(anchorEl) && selectedItem === project}
                                    onClose={handleClose}
                                    anchorEl={anchorEl}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            handleClose()
                                            router.push(`projects/${project.id}/tasks`)
                                        }}
                                    >
                                        <ListItemIcon>
                                            <ArrowForwardIcon fontSize="medium" />
                                        </ListItemIcon>
                                        <ListItemText>
                                            Go to Project
                                        </ListItemText>
                                    </MenuItem>
                                    {project.creator === user?.email &&
                                        <MenuItem
                                            onClick={() => {
                                                handleClose()
                                                router.push(`projects/${project.id}/edit`)
                                            }}
                                        >
                                            <ListItemIcon>
                                                <EditIcon fontSize="medium" />
                                            </ListItemIcon>
                                            <ListItemText>
                                                Edit project
                                            </ListItemText>
                                        </MenuItem>
                                    }
                                    {project.creator === user?.email &&
                                        <MenuItem
                                            onClick={() => {
                                                handleClose()
                                                handleDeleteProject()
                                            }}
                                        >
                                            <ListItemIcon>
                                                <DeleteIcon fontSize="medium" />
                                            </ListItemIcon>
                                            <ListItemText>
                                                Delete project
                                            </ListItemText>
                                        </MenuItem>
                                    }
                                </Menu>
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}