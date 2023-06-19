import { Box, IconButton, Modal } from "@mui/material";
import IProject from "../../types/project";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import CloseIcon from '@mui/icons-material/Close';
import ProjectForm from "../ProjectForm";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: '350px',
        sm: '500px',
        lg: '750px'
    },
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 2
}

export default function ProjectModal({ isOpen, setIsOpen, selectedItem, setSelectedItem, project, user }: { isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, selectedItem: IProject | null, setSelectedItem: React.Dispatch<React.SetStateAction<IProject | null>>, project: IProject, user: UserProfile | undefined }) {
    const handleClose = () => {
        setIsOpen(false);
        setSelectedItem(null);
    }

    return (
        <Modal
            open={isOpen && selectedItem?.id === project.id}
            onClose={() => setIsOpen(!isOpen)}
        >
            <Box sx={style}>
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <ProjectForm
                        user={user}
                        method="PATCH"
                        project={project}
                    />
                </>
            </Box>
        </Modal>
    )
}