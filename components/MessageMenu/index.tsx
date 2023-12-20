import { Menu, MenuItem } from "@mui/material";
import { IMessage } from "../../types/chat";
import axios from "axios";

interface IProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  message: IMessage;
}

function MessageMenu({ anchorEl, setAnchorEl, message }: IProps) {
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <MenuItem>Edit</MenuItem>
      <MenuItem onClick={handleRemoveMessage}>Remove</MenuItem>
    </Menu>
  );
}

export default MessageMenu;
