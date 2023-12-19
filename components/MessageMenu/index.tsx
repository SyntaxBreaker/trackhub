import { Menu, MenuItem } from "@mui/material";
import { IMessage } from "../../types/chat";

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

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem>Edit</MenuItem>
      <MenuItem>Remove</MenuItem>
    </Menu>
  );
}

export default MessageMenu;
