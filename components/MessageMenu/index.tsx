import { Menu, MenuItem } from "@mui/material";
import { IMessage } from "../../types/chat";
import axios from "axios";

interface IProps {
  anchorEl: HTMLElement | null;
  message: IMessage;
  handleClose: () => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

function MessageMenu({ anchorEl, message, handleClose, setIsEditing }: IProps) {
  const open = Boolean(anchorEl);

  const handleRemoveMessage = async () => {
    try {
      handleClose();
      await axios.delete(`/api/chat/delete/${message.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem
        onClick={() => {
          setIsEditing(true);
          handleClose();
        }}
      >
        Edit
      </MenuItem>
      <MenuItem onClick={handleRemoveMessage}>Remove</MenuItem>
    </Menu>
  );
}

export default MessageMenu;
