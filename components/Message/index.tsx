import {
  Box,
  Button,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { IMessage } from "../../types/chat";
import Image from "next/image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { SyntheticEvent, useState } from "react";
import MessageMenu from "../MessageMenu";
import axios from "axios";
import { IAlertStatus } from "../../types/alertStatus";

function Message({
  message,
  setAlertStatus,
}: {
  message: IMessage;
  setAlertStatus: React.Dispatch<React.SetStateAction<IAlertStatus | null>>;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState<null | string>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditMessage = async (e: SyntheticEvent) => {
    try {
      e.preventDefault();
      handleClose();
      setIsEditing(false);
      const { data } = await axios.patch(`/api/chat/edit`, {
        message: updatedMessage,
        id: message.id,
      });
      setAlertStatus({ status: "success", message: data.message });
    } catch (err: any) {
      setAlertStatus({ status: "error", message: err.message });
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1.5 }}>
      <Image
        src={message.authorAvatar}
        width={32}
        height={32}
        style={{ borderRadius: "50%" }}
        alt="Avatar"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          maxWidth: "75%",
        }}
      >
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Typography variant="subtitle1" component="h2">
            {message.authorName}
          </Typography>
          <IconButton size="small" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        {isEditing ? (
          <FormControl
            component="form"
            sx={{ display: "flex", gap: 1 }}
            onSubmit={handleEditMessage}
          >
            <TextField
              value={updatedMessage ? updatedMessage : message.text}
              onChange={(e) => setUpdatedMessage(e.target.value)}
            />
            <Button variant="contained" type="submit">
              Edit message
            </Button>
          </FormControl>
        ) : (
          <Typography
            variant="body2"
            sx={{
              padding: 1,
              borderRadius: "4px",
              backgroundColor: "#f5f5f5",
              color: "black",
            }}
          >
            {message.text}
          </Typography>
        )}
      </Box>
      <MessageMenu
        anchorEl={anchorEl}
        message={message}
        handleClose={handleClose}
        setIsEditing={setIsEditing}
        setAlertStatus={setAlertStatus}
      />
    </Box>
  );
}

export default Message;
