import { Box, Modal, Typography, IconButton, AvatarGroup, Tooltip, Avatar } from "@mui/material";
import ITask from "../../types/task";
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { calculateRemainingDays } from '../../utils/date';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'clamp(350px, 50%, 500px)',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 2
}

export default function TaskModal({ isOpen, setIsOpen, setSelectedItem, selectedItem, task }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, setSelectedItem: React.Dispatch<React.SetStateAction<ITask | null>>, selectedItem: ITask | null, task: ITask }) {
    const handleClose = () => {
        setIsOpen(false);
        setSelectedItem(null);
    }

    return (
        <Modal
            open={isOpen && selectedItem?.id === task.id}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="h2">{task.name}</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>{task.description}</Typography>
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