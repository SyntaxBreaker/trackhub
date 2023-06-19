import { Box, Modal, Typography, IconButton, AvatarGroup, Tooltip, Avatar, TextField, FormControlLabel, Checkbox, Button, Alert } from "@mui/material";
import ITask from "../../types/task";
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { calculateRemainingDays } from '../../utils/date';
import TaskForm from "../TaskForm";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import axios from "axios";
import { useState } from "react";
import validateField from "../../utils/validateField";
import CommentList from "../CommentList";
import { useRouter } from "next/router";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '90%',
    width: {
        xs: '350px',
        sm: '500px',
        lg: '750px'
    },
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 2,
    overflowY: 'scroll'
}

export default function TaskModal({ isOpen, setIsOpen, setSelectedItem, selectedItem, task, user }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, setSelectedItem: React.Dispatch<React.SetStateAction<ITask | null>>, selectedItem: ITask | null, task: ITask, user: UserProfile | undefined }) {
    const [comments, setComments] = useState(task.comments || []);
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);

    const router = useRouter();
    const { id } = router.query;

    const handleClose = () => {
        setIsOpen(false);
        setSelectedItem(null);
    }

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        axios.post('/api/comments/create', {
            comment: {
                authorId: user?.email,
                authorName: user?.name,
                authorAvatar: user?.picture,
                text: comment
            },
            id: task.id
        })
            .then(res => {
                setError(null);
                window.location.href = `/projects/${id}/tasks`
            })
            .catch(err => {
                setError(err.message);
            })

        setComment('');
    }

    return (
        <Modal
            open={isOpen && selectedItem?.id === task.id}
            onClose={handleClose}
        >
            <Box sx={style}>
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <TaskForm
                        user={user}
                        method="PATCH"
                        task={task}
                    />
                    <CommentList
                        comments={comments}
                    />
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Leave a comment"
                            sx={{ width: '100%' }}
                            error={!validateField(comment) ? true : false}
                            helperText={!validateField(comment) && "This comment should have at least one character."}
                            id="comment"
                            name="comment"
                            variant="outlined"
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                        />
                    </Box>
                </>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                    <Typography sx={{ fontSize: 12 }} color="text.secondary">
                        <AccessTimeIcon color="warning" sx={{ fontSize: 12, verticalAlign: 'text-top' }} /> {task.status === 'COMPLETED' ? 'Completed' : calculateRemainingDays(task.deadline) >= 1 ? `Due in ${calculateRemainingDays(task.deadline)} ${calculateRemainingDays(task.deadline) === 1 ? 'day' : 'days'}` : calculateRemainingDays(task.deadline) === 0 ? 'Due is Today' : 'Overdue'}
                    </Typography>
                    <AvatarGroup>
                        <Tooltip title={task.authorName} arrow>
                            <Avatar src={task.authorAvatar} alt={task.authorName} sx={{ width: 24, height: 24 }} />
                        </Tooltip>
                    </AvatarGroup>
                </Box>
            </Box>
        </Modal>
    )
}