import { Menu, MenuItem } from "@mui/material";
import { IMessage } from "../../types/chat";
import axios from "axios";
import { IAlertStatus } from "../../types/alertStatus";

interface IProps {
  anchorEl: HTMLElement | null;
  message: IMessage;
  handleClose: () => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertStatus: React.Dispatch<React.SetStateAction<IAlertStatus | null>>;
}

function MessageMenu({
  anchorEl,
  message,
  handleClose,
  setIsEditing,
  setAlertStatus,
}: IProps) {
  const open = Boolean(anchorEl);

  const handleRemoveMessage = async () => {
    try {
      handleClose();
      const { data } = await axios.delete(`/api/chat/delete/${message.id}`);
      setAlertStatus({ status: "success", message: data.message });
    } catch (err: any) {
      setAlertStatus({ status: "error", message: err.message });
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
